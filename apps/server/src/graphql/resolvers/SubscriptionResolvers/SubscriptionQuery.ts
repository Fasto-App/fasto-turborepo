import { Connection } from "mongoose";
import { QueryResolvers, StripeSubscriptionResolvers } from "../../../generated/graphql";
import { AddressModel, BusinessModel, UserModel } from "../../../models";
import { stripe } from "../../../stripe";
import { getCountry } from "../helpers/helpers";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import Stripe from "stripe";

//@ts-ignore
const getSubscriptionPrices: QueryResolvers["getSubscriptionPrices"] = async (_, {
  input
}, {
  business,
  db
}) => {
  if (business) {

    const foundCountry = await getCountry({ db, business })
    const pricesResponse = await stripe(foundCountry).prices.list({
      limit: 3,
      expand: ['data.product'],
    });

    return pricesResponse.data.reverse()
  }

  if (!input?.country) throw ApolloError(new Error("No country"), "BadRequest",)

  const pricesResponse = await stripe(input?.country).prices.list({
    limit: 3,
    expand: ['data.product'],
  });

  return pricesResponse.data.reverse()
}

//@ts-ignore
const getSignUpSubscription: QueryResolvers["getSignUpSubscription"] = async (parent, args, { db, user, business }) => {
  const foundBusiness = await BusinessModel(db).findById(business)

  if (!foundBusiness || !foundBusiness?.country) {
    throw ApolloError(new Error("you need a country"), "Unauthorized")
  }

  // Todo: achar o stripe ID do business logado, nao do usuario.
  // Todo: O business que eh o customer, nao o Usuario.
  const foundUser = await UserModel(db).findById(user?._id)
  if (!foundUser?.stripeCustomer) return null

  const subscriptions = await stripe(foundBusiness?.country).subscriptions.list({
    customer: foundUser?.stripeCustomer,
    status: 'active', // todo: we should see all subscriptions, not just the active ones
    expand: ['data.default_payment_method'],
  });

  return subscriptions.data?.[0]
}

const getTier: StripeSubscriptionResolvers["tier"] = async (parent, args, { db, business, user }) => {

  const country = await getCountry({ db, business, })
  if (!country) throw ApolloError(new Error("you need a country"), "Unauthorized",)

  const pricesResponse = await stripe(country).prices.list({
    limit: 3,
    expand: ['data.product'],
  });

  const plan = pricesResponse.data.find(price => price.id === parent.items.data[0].price.id)

  return (plan?.product as Stripe.Product).name
}

export const SubscriptionResolvers = {
  getTier
}


export const SubscriptionQuery = {
  getSubscriptionPrices,
  getSignUpSubscription
}