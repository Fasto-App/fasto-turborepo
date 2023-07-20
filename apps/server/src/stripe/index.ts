// import { ApolloError } from 'apollo-server-express';
import Stripe from 'stripe';
import { ApolloError } from '../graphql/ApolloErrorExtended/ApolloErrorExtended';
import { appRoute, businessRoute } from "fasto-route"

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
}

export const stripeAuthorize = async (accountsParams: AccountParams) => {

  console.log("stripeAuthorize", accountsParams)
  const URL = "https://fastoapp.dev" +
    appRoute.customerRoute["/customer/[businessId]"].
      replace("[businessId]", accountsParams.businessId) || undefined

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

export const stripeOnboard = async (accountId: string) => {

  console.log("stripeOnboard", accountId)

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.FRONTEND_URL + businessRoute.payments,
      return_url: process.env.FRONTEND_URL + businessRoute.payments,
      type: 'account_onboarding'
    });

    // Redirect to Stripe to start the Express onboarding flow
    return accountLink;

  } catch (err) {
    throw ApolloError('BadRequest', `Error creating Express accountLinks: ${err}`);
  }
  // Create an account link for the user's Stripe account
}

const stripeOnboarded = async (accountId: string) => {
  try {
    // Retrieve the user's Stripe account and check if they have finished onboarding
    const account = await stripe.accounts.retrieve(accountId);
    if (account.details_submitted) {
      // req.user.onboardingComplete = true;
      // await req.user.save();

      // Redirect to the Rocket Rides dashboard
      // req.flash('showBanner', 'true');
      // res.redirect('/pilots/dashboard');
    } else {
      // console.log('The onboarding process was not completed.');
      // res.redirect('/pilots/signup');
    }
  } catch (err) {
    // console.log('Failed to retrieve Stripe account information.');
    // console.log(err);
    // next(err);
  }

}
