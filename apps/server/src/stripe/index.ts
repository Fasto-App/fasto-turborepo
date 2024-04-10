// import { ApolloError } from 'apollo-server-express';
import Stripe from 'stripe';
import { ApolloError } from '../graphql/ApolloErrorExtended/ApolloErrorExtended';
import { appRoute, businessRoute } from "fasto-route"
import { Locale, SERVICE_FEE, getPercentageOfValue } from 'app-helpers';
import { PaymentModel } from '../models/payment';
import { CheckoutModel } from '../models/checkout';
import { RequestModel, TabModel, TableModel } from '../models';
import { Connection } from 'mongoose';
import { createPaymentNotification, updateProductQuantity } from '../graphql/resolvers/helpers/helpers';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY_BRAZIL) {
  throw ApolloError(new Error('Missing Stripe secret key env var'), 'InternalServerError');
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
    throw ApolloError(err as Error, 'BadRequest');
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

    throw ApolloError(err as Error, 'BadRequest');
  }

}

type CreatePaymentIntentProps = {
  amount: number;
  serviceFee?: number;
  stripeAccount: string;
  businessId: string;
  checkoutId: string;
  paymentId: string;
  description: string;

  country: "US" | "BR";
}

export const createPaymentIntent = async ({
  amount,
  serviceFee,
  stripeAccount,
  businessId,
  checkoutId,
  paymentId,
  description,
  country,
}: CreatePaymentIntentProps) => {

  try {
    const paymentIntent = await stripe(country).paymentIntents.create({
      amount: Math.ceil(amount),
      currency: country === "US" ? "USD" : "BRL",
      description,
      automatic_payment_methods: { enabled: true },
      application_fee_amount: Math.ceil(serviceFee ?? 0),
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

    throw ApolloError(err as Error, 'BadRequest', "customer");
  }
}

export type Metada = {
  test: string;
  business_id: string;
  checkout_id: string;
  payment_id: string;
}

export const confirmPaymentWebHook = async (metadata: Metada, db: Connection) => {
  const { payment_id } = metadata;
console.log("**************")
  const foundPayment = await PaymentModel(db).findById(payment_id);
  if (!foundPayment) throw ApolloError(new Error('Payment not found.'), 'BadRequest');

  const foundCheckout = await CheckoutModel(db).findById(foundPayment?.checkout);
  if (!foundCheckout) throw ApolloError(new Error('Check not found.'), 'BadRequest');

  const foundTab = await TabModel(db).findById(foundCheckout.tab);
  if (!foundTab) throw ApolloError(new Error('Tab not found'), 'BadRequest');

  foundPayment.paid = true;
  await foundPayment.save();

  foundCheckout.totalPaid += foundPayment.amount;

  if (foundCheckout.totalPaid >= foundCheckout.total) {
    if (foundTab?.table) {
      const foundTable = await TableModel(db).findByIdAndUpdate(foundTab.table);
      if (!foundTable) throw ApolloError(new Error('Table not found'), 'BadRequest');
    
      foundTable.status = 'Available';
      foundTable.tab = undefined;
      await foundTable.save();
    }
    
    foundTab.status = 'Closed';
    await foundTab.save();

    // when the payment is made, subtract from
    foundCheckout.status = 'Paid';
    foundCheckout.paid = true;
    foundCheckout.updated_at = new Date();

    await updateProductQuantity(foundCheckout, db);

    // update all the requests associated with this tab
    const foundRequests = await RequestModel(db).find({ tab: foundTab?._id });
    if (foundRequests.length > 0) {
      const savePromises = foundRequests.map((request) => {
        console.log('************')
        request.status = 'Completed';
        return request.save();
      });

      await Promise.all(savePromises);
    }
    
  }
  
//   export const createPaymentNotification = async (sender: string, businessId: string, paymentId: string) admin user, check businessId: string
  // @ts-ignore
  await createPaymentNotification(foundTab.admin, foundCheckout.business, foundPayment._id)

  await foundCheckout.save();
};
