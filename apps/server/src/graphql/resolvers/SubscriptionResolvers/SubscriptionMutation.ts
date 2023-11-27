import { MutationResolvers } from "../../../generated/graphql";
import { BusinessModel, UserModel } from "../../../models";
import { stripe } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { getCountry } from "../helpers/helpers";

const createSubscription: MutationResolvers["createSubscription"] = async (par, { input: { price } }, { user, db, business }) => {
  if (!business) throw ApolloError("BadRequest")

  const foundBusiness = await BusinessModel(db).findById(business)
  const foundUser = await UserModel(db).findById(user?._id)
  if (!foundUser || !foundBusiness || !foundUser.email) {
    throw ApolloError("NotFound", "User, Email or Business not found")
  }

  const country = await getCountry({ db, business });
  if (!country) throw ApolloError("Unauthorized", "you need a country")

  if (!foundUser.stripeCustomer) {
    const customer = await stripe(country).customers.create({
      email: foundUser.email,
    });

    foundUser.stripeCustomer = customer.id
    await foundUser.save()
  }

  const subscription = await stripe(country).subscriptions.create({
    customer: foundUser.stripeCustomer,
    items: [{ price }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  if (!subscription ||
    typeof subscription.latest_invoice === "string" ||
    typeof subscription.latest_invoice?.payment_intent === "string" ||
    !subscription.latest_invoice?.payment_intent?.client_secret
  ) throw ApolloError("InternalServerError", "Error Creating Subscription")

  return ({
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    price
  });
}
// @ts-ignore
const updateSubscription: MutationResolvers["updateSubscription"] = async (parent, { input: {
  price, subscription
} }, { db, business }) => {
  const country = await getCountry({ db, business });
  if (!country) throw ApolloError("Unauthorized", "you need a country")

  const foundSubscription = await stripe(country).subscriptions.retrieve(
    subscription
  );

  if (!foundSubscription) throw ApolloError("NotFound", "Subscription Not Found")

  const updatedSubscription = await stripe(country).subscriptions.update(
    subscription, {
    items: [{
      id: foundSubscription.items.data[0].id,
      price,
    }],
  });

  return updatedSubscription
}
// @ts-ignore
const cancelSubscription: MutationResolvers["cancelSubscription"] = async (parent, { input: { subscription } }, { db, business }) => {
  const country = await getCountry({ db, business });
  if (!country) throw ApolloError("Unauthorized", "you need a country")

  const deletedSubscription = await stripe(country).subscriptions.del(subscription);
  if (!deletedSubscription) throw ApolloError("NotFound", "Subscription Not Found")

  return deletedSubscription
}

export const SubscriptionMutation = {
  createSubscription,
  updateSubscription,
  cancelSubscription
}