import { businessRoute } from "fasto-route";
import { QueryResolvers } from "../../../generated/graphql";
import { AddressModel, BusinessModel } from "../../../models";
import { stripe } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

const getIsConnected: QueryResolvers["getIsConnected"] = async (_, _args, { business, db }) => {

  const foundBusiness = await BusinessModel(db).findById(business);

  if (!foundBusiness?.stripeAccountId) return null

  const foundAddress = await AddressModel(db).findById(foundBusiness.address)
  if (!foundAddress || !foundAddress.country) {
    throw new Error("Address not found")
  }

  const account = await stripe(foundAddress.country).accounts.retrieve(foundBusiness?.stripeAccountId);

  if (!account.details_submitted) return null

  const balance = await stripe(foundAddress.country).balance.retrieve({
    stripeAccount: foundBusiness?.stripeAccountId,
  });

  return ({
    balanceAvailable: balance.available[0].amount,
    balancePending: balance.pending[0].amount,
    balanceCurrency: (balance.available[0].currency),
    name: account.business_profile?.name,
    url: account.business_profile?.url,
  })
}

const createStripeAccessLink: QueryResolvers["createStripeAccessLink"] = async (_, _args, { business, db }) => {
  const foundBusiness = await BusinessModel(db).findById(business);

  if (!foundBusiness?.stripeAccountId) return null

  const foundAddress = await AddressModel(db).findById(foundBusiness.address)
  if (!foundAddress || !foundAddress.country) {
    throw new Error("Address not found")
  }

  const loginLink = await stripe(foundAddress.country).accounts.createLoginLink(
    foundBusiness?.stripeAccountId
  );

  return loginLink.url
}

export const PaymentQuery: QueryResolvers = {
  getIsConnected,
  createStripeAccessLink
}