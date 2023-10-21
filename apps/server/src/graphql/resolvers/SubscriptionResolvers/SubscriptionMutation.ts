import { MutationResolvers } from "../../../generated/graphql";
import { UserModel } from "../../../models";
import { stripe } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

const createSubscription: MutationResolvers["createSubscription"] = async (par, { input: { price } }, { user, db }) => {
  const foundUser = await UserModel(db).findById(user?._id)
  if (!foundUser || !foundUser.email) throw ApolloError("NotFound", "User Not Found")

  if (!foundUser.stripeCustomer) {
    const customer = await stripe("US").customers.create({
      email: foundUser.email,
    });

    foundUser.stripeCustomer = customer.id
    await foundUser.save()
  }

  const subscription = await stripe("US").subscriptions.create({
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
} }) => {
  const foundSubscription = await stripe("US").subscriptions.retrieve(
    subscription
  );

  if (!foundSubscription) throw ApolloError("NotFound", "Subscription Not Found")

  const updatedSubscription = await stripe("US").subscriptions.update(
    subscription, {
    items: [{
      id: foundSubscription.items.data[0].id,
      price,
    }],
  });

  return updatedSubscription
}
// @ts-ignore
const cancelSubscription: MutationResolvers["cancelSubscription"] = async (parent, { input: { subscription } }) => {

  const deletedSubscription = await stripe("US").subscriptions.del(subscription);
  if (!deletedSubscription) throw ApolloError("NotFound", "Subscription Not Found")

  return deletedSubscription
}

export const SubscriptionMutation = {
  createSubscription,
  updateSubscription,
  cancelSubscription
}