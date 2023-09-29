// import { ApolloError } from 'apollo-server-express';
import Stripe from 'stripe';
import { ApolloError } from '../graphql/ApolloErrorExtended/ApolloErrorExtended';
import { appRoute, businessRoute } from "fasto-route"
import { Locale } from 'app-helpers';
import { PaymentModel } from '../models/payment';
import { CheckoutModel } from '../models/checkout';
import { RequestModel, TabModel, TableModel } from '../models';
import { Connection } from 'mongoose';
import { updateProductQuantity } from '../graphql/resolvers/helpers/helpers';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY_BRAZIL) {
  throw ApolloError('InternalServerError', 'Missing Stripe secret key env var');
}

const apiVersion = '2022-11-15'

export const stripeUSA = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion
});

const stripeBrazil = new Stripe(process.env.STRIPE_SECRET_KEY_BRAZIL, {
  apiVersion
})

export const stripe = (country: "US" | "BR") => {
  return country === "US" ? stripeUSA : stripeBrazil;
};

type AccountParams = {
  businessId: string;
  firstName: string;
  email: string;
  country: "US" | "BR";
  business_type: "company" | "individual";
  businessName: string;
  locale: Locale;
}

const TEST_URL = "https://fastoapp.dev"
const is_dev = process.env.ENVIRONMENT === "development"

export const stripeAuthorize = async (accountsParams: AccountParams) => {

  const URL = is_dev ? TEST_URL : process.env.FRONTEND_URL +
    appRoute.customerRoute["/customer/[businessId]"].
      replace("[businessId]", accountsParams.businessId) || undefined

  try {
    let accountId: null | string = null;
    // Define the parameters to create a new Stripe account with
    let accountParams: Stripe.AccountCreateParams = {
      type: 'express',
      country: accountsParams.country,
      email: accountsParams.email,
      business_type: accountsParams.business_type,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        url: URL
      },
    }

    // Companies and individuals require different parameters
    if (accountParams.business_type === 'company') {
      accountParams = Object.assign(accountParams, {
        company: {
          name: accountsParams.businessName || undefined
        }
      });
    } else {
      accountParams = Object.assign(accountParams, {
        individual: {
          first_name: accountsParams.firstName || undefined,
          email: accountsParams.email || undefined
        }
      });
    }

    const account = await stripe(accountsParams.country).accounts.create(accountParams);
    accountId = account.id;

    return accountId;
  } catch (err) {
    throw ApolloError('BadRequest', `Error creating Express Account: ${err}`);
  }
}

export const stripeOnboard = async (accountId: string, locale: Locale, country: "US" | "BR") => {

  try {
    const accountLink = await stripe(country).accountLinks.create({
      account: accountId,
      refresh_url: process.env.FRONTEND_URL + `/${locale}` + businessRoute.payments,
      return_url: process.env.FRONTEND_URL + `/${locale}` + businessRoute.payments,
      type: 'account_onboarding'
    });

    // Redirect to Stripe to start the Express onboarding flow
    return accountLink;

  } catch (err) {
    throw ApolloError('BadRequest', `Error creating Express accountLinks: ${err}`);
  }
  // Create an account link for the user's Stripe account
}

type CreatePaymentIntentProps = {
  amount: number;
  stripeAccount: string;
  businessId: string;
  checkoutId: string;
  paymentId: string;
  description: string;
  country: "US" | "BR";
}

export const createPaymentIntent = async ({
  amount,
  stripeAccount,
  businessId,
  checkoutId,
  paymentId,
  description,
  country,
}: CreatePaymentIntentProps) => {

  try {
    const paymentIntent = await stripe(country).paymentIntents.create({
      amount: Math.trunc(amount),
      currency: country === "US" ? "USD" : "BRL",
      description,
      automatic_payment_methods: { enabled: true },
      application_fee_amount: Math.trunc(amount * 0.05) + country === "US" ? 30 : (5 * 30),
      transfer_data: {
        destination: stripeAccount,
      },
      transfer_group: checkoutId,
      // confirm: true, // todo mode info is needed for this
      // https://stripe.com/docs/api/payment_intents/create#create_payment_intent-confirm
      on_behalf_of: stripeAccount,
      metadata: {
        "test": `${businessId} ${checkoutId} ${paymentId}`,
        "business_id": `${businessId}`,
        "checkout_id": `${checkoutId}`,
        "payment_id": `${paymentId}`,
      } as Metada
    });

    return paymentIntent;
  } catch (err) {

    throw ApolloError('BadRequest', `Error creating paymentIntent: ${err}`, "client");
  }
}

export type Metada = {
  test: string;
  business_id: string;
  checkout_id: string;
  payment_id: string;
}

export const confirmPaymentWebHook = async (metadata: Metada, db: Connection) => {
  const { payment_id } = metadata

  const foundPayment = await PaymentModel(db).findById(payment_id)
  if (!foundPayment) throw ApolloError("BadRequest", "Payment not found.")

  const foundCheckout = await CheckoutModel(db).findById(foundPayment?.checkout)
  if (!foundCheckout) throw ApolloError("BadRequest", "Payment not found.")

  const foundTab = await TabModel(db).findById(foundCheckout.tab)
  if (!foundTab) throw ApolloError("BadRequest", 'Tab not found')

  foundPayment.paid = true;
  await foundPayment.save()

  foundCheckout.totalPaid += foundPayment.amount

  if (foundCheckout.totalPaid >= foundCheckout.total) {

    if (foundTab?.table) {
      const foundTable = await TableModel(db).findByIdAndUpdate(foundTab.table)
      if (!foundTable) throw ApolloError("BadRequest", 'Table not found')

      foundTable.status = "Available"
      foundTable.tab = undefined
      await foundTable.save()
    }

    foundTab.status = "Closed"
    await foundTab.save()

    // when the payment is made, subtract from
    foundCheckout.status = "Paid"
    foundCheckout.paid = true

    await updateProductQuantity(foundCheckout, db)

    // update all the requests associated with this tab
    const foundRequests = await RequestModel(db).find({ tab: foundTab?._id })
    if (foundRequests.length > 0) {
      const savePromises = foundRequests.map((request) => {
        request.status = "Completed"
        return request.save()
      });
      const awaitedRequests = await Promise.all(savePromises);
      console.log("awaitedRequests", awaitedRequests)
    }

    // Tab closed. Perhaps send an email?
  }

  await foundCheckout.save()
}