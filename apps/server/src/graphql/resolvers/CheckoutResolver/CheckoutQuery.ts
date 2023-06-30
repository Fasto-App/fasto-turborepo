import { QueryResolvers } from "../../../generated/graphql";
import { CheckoutModel } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

// @ts-ignore
export const getCheckoutByID: QueryResolvers["getCheckoutByID"] = async (parent, { input }, { db, client, user }) => {
  const Checkout = CheckoutModel(db);

  if (!client && !user) throw ApolloError("Unauthorized", "You must be logged in to perform this action")

  const checkout = await Checkout.findOne({ _id: input._id, business: client?.business || user?.business });
  if (!checkout) throw ApolloError("NotFound", "Checkout not found");
  return checkout
}

// @ts-ignore
export const getCheckoutsByBusiness: QueryResolvers["getCheckoutsByBusiness"] = async (_parent, args, { db, business }) => {
  const Checkout = CheckoutModel(db);
  const checkouts = await Checkout.find({ business: business }).sort({ _id: -1 });
  return checkouts
}

// @ts-ignore
export const getOrdersByCheckout: QueryResolvers["getOrdersByCheckout"] = async (parent, { input }, { db }) => {
  const Checkout = CheckoutModel(db);
  const checkout = await Checkout.findById(input._id);

  if (!checkout) throw ApolloError("NotFound", "Checkout not found");

  return checkout
}


const CheckoutResolverQuery = {
  getCheckoutByID,
  getCheckoutsByBusiness,
  getOrdersByCheckout,
}

export {
  CheckoutResolverQuery,
}