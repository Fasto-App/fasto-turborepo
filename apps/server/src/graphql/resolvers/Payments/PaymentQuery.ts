import { QueryResolvers } from "../../../generated/graphql";
import { BusinessModel } from "../../../models";
import { stripe } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

const getBalance: QueryResolvers["getBalance"] = async (parent, args, { business, db }) => {
  const foundBusiness = await BusinessModel(db).findById(business);

  if (!foundBusiness) {
    throw ApolloError("Unauthorized", "Business not found");
  }

  if (!foundBusiness?.stripeAccountId) {
    throw ApolloError("Unauthorized", "Business not connected to Stripe");
  }

  const balance = await stripe.balance.retrieve({
    stripeAccount: foundBusiness.stripeAccountId,
  });

  return ({
    balanceAvailable: balance.available[0].amount,
    balancePending: balance.pending[0].amount,
    balanceCurrency: balance.available[0].currency,
  });

}

export const PaymentQuery = {
  getBalance
}