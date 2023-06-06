import { QueryResolvers } from "../../../generated/graphql";
import { CheckoutModel } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

export const getCheckoutByID = async (parent: any, args: any, { db }: Context, info: any) => {
  const Checkout = CheckoutModel(db);
  const checkout = await Checkout.findById(args.input._id);
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