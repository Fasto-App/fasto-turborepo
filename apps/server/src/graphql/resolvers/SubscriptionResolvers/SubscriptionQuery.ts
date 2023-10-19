import { QueryResolvers } from "../../../generated/graphql";
import { UserModel } from "../../../models";
import { stripe } from "../../../stripe";

//@ts-ignore
const getSubscriptionPrices: QueryResolvers["getSubscriptionPrices"] = async () => {
  // TODO: get the specific subscriptions instead of querying for the 3 first ones
  const pricesResponse = await stripe("US").prices.list({
    limit: 3,
    expand: ['data.product'],
  });

  return pricesResponse.data.reverse()
}

const getSignUpSubscriptions: QueryResolvers["getSignUpSubscriptions"] = async (parent, args, { db, user }) => {
  const foundUser = await UserModel(db).findById(user?._id)
  if (!foundUser?.stripeCustomer) return null

  const subscriptions = await stripe("US").subscriptions.list({
    customer: foundUser.stripeCustomer,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  console.log(subscriptions)

  return subscriptions.data
}


export const SubscriptionQuery = {
  getSubscriptionPrices,
  getSignUpSubscriptions
}