import { Connection } from "mongoose";
import { QueryResolvers } from "../../../generated/graphql";
import { AddressModel, BusinessModel, UserModel } from "../../../models";
import { stripe } from "../../../stripe";
import { getCountry } from "../helpers/helpers";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

//@ts-ignore
const getSubscriptionPrices: QueryResolvers["getSubscriptionPrices"] = async (_, {
  country: countryInput
}, {
  business,
  db
}) => {
  const country = await getCountry({ db, business, input: countryInput })
  if (!country) throw ApolloError("Unauthorized", "you need a country")

  // TODO: get the specific subscriptions instead of querying for the 3 first ones
  const pricesResponse = await stripe(country).prices.list({
    limit: 3,
    expand: ['data.product'],
  });

  return pricesResponse.data.reverse()
}

//@ts-ignore
const getSignUpSubscription: QueryResolvers["getSignUpSubscription"] = async (parent, args, { db, user, business }) => {
  const country = await getCountry({ db, business, })
  if (!country) throw ApolloError("Unauthorized", "you need a country")

  // O business que eh o customer, nao o Usuario
  const foundUser = await UserModel(db).findById(user?._id)
  if (!foundUser?.stripeCustomer) return null

  const subscriptions = await stripe(country).subscriptions.list({
    customer: foundUser?.stripeCustomer,
    status: 'active',
    expand: ['data.default_payment_method'],
  });

  return subscriptions.data?.[0]
}


export const SubscriptionQuery = {
  getSubscriptionPrices,
  getSignUpSubscription
}