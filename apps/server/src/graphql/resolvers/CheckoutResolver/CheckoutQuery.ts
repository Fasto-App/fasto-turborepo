import { QueryResolvers } from "../../../generated/graphql";
import { CheckoutModel } from "../../../models/checkout";
import { Context } from "../types";

export const getCheckoutByID = async (parent: any, args: any, { db }: Context, info: any) => {
  const Checkout = CheckoutModel(db);
  const checkout = await Checkout.findById(args.input._id);
  return checkout
}

// @ts-ignore
export const getCheckoutsByBusiness: QueryResolvers["getCheckoutsByBusiness"] = async (_parent, args, { db, business }) => {
  const Checkout = CheckoutModel(db);
  const checkouts = await Checkout.find({ business: business });
  return checkouts
}


const CheckoutResolverQuery = {
  getCheckoutByID,
  getCheckoutsByBusiness,
}

export {
  CheckoutResolverQuery,
}