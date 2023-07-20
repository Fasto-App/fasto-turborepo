import { MutationResolvers } from "../../../generated/graphql";
import { BusinessModel, UserModel } from "../../../models";
import { stripeAuthorize, stripeOnboard } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";


const connectExpressPayment: MutationResolvers["connectExpressPayment"] = async (parent, { input }, { db, user }) => {
  const Business = BusinessModel(db);
  const User = UserModel(db);

  const foundBusiness = await Business.findOne({ _id: user?.business });
  const foundUser = await User.findOne({ _id: user?._id })

  if (!foundBusiness || !foundUser) throw ApolloError('Unauthorized', "Not Authorized. Please login again.")

  let accountId = foundBusiness.stripeAccountId;

  if (!accountId) {

    accountId = await stripeAuthorize({
      firstName: foundUser.name as string,
      email: foundBusiness.email,
      businessName: foundBusiness.name,
      country: input.country,
      business_type: input.business_type,
      businessId: foundBusiness._id
    })

    foundBusiness.stripeAccountId = accountId;
    await foundBusiness.save();
  }

  const accountLink = await stripeOnboard(accountId);

  return accountLink.url
}

export const PaymentMutation = {
  connectExpressPayment
}