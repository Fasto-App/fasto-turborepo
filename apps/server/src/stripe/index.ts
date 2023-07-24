// import { ApolloError } from 'apollo-server-express';
import Stripe from 'stripe';
import { ApolloError } from '../graphql/ApolloErrorExtended/ApolloErrorExtended';
import { appRoute, businessRoute } from "fasto-route"
import { Locale } from 'app-helpers';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key env var');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// the function may come from here
// accept the arguments and trigger the stripe api
// Path: apps/server/src/stripe/create-checkout-session.ts

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

  console.log("stripeAuthorize", accountsParams)
  console.log({ URL })

  try {
    let accountId: null | string = null;
    // Define the parameters to create a new Stripe account with
    let accountParams: Stripe.AccountCreateParams = {
      type: 'express',
      country: accountsParams.country || undefined,
      email: accountsParams.email || undefined,
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

    const account = await stripe.accounts.create(accountParams);
    accountId = account.id;

    return accountId;
  } catch (err) {
    console.log("stripeAuthorize", err)
    throw ApolloError('BadRequest', `Error creating Express Account: ${err}`);
  }
}

export const stripeOnboard = async (accountId: string, locale: Locale) => {

  console.log("stripeOnboard", accountId)

  try {
    const accountLink = await stripe.accountLinks.create({
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
  currency: string;
  stripeAccount: string;
  locale: Locale;
  businessId: string;
  checkoutId: string;
}

export const createPaymentIntent = async (props: CreatePaymentIntentProps) => {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: props.amount,
      currency: "USD",
      description: 'Fasto Checkout',
      automatic_payment_methods: { enabled: true },
      // payment_method_types: ['card'],
      // confirm: true,
      // automatic_payment_methods: {
      //   enabled: true,
      //   allow_redirects: "always",
      // },
      // application_fee_amount: props.amount * 0.5,
      // on_behalf_of: props.stripeAccount,
      // return_url: process.env.FRONTEND_URL + `/${props.locale}` +
      //   customerRoute['/customer/[businessId]/checkout/[checkoutId]'].
      //     replace("[businessId]", props.businessId).
      //     replace("[checkoutId]", props.checkoutId)
    });

    console.log("PAYMENT INTENT", paymentIntent)

    return paymentIntent;

  } catch (err) {

    console.log("FAILED PAYMENT INTENT", err)

    throw ApolloError('BadRequest', `Error creating paymentIntent: ${err}`, "client");
  }
}
