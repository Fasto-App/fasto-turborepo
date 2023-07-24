import { MutationResolvers } from "../../../generated/graphql";
import { BusinessModel, UserModel } from "../../../models";
import { createPaymentIntent, stripeAuthorize, stripeOnboard } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

const generatePaymentIntent: MutationResolvers["generatePaymentIntent"] = async (parent, args,
  { db, user, locale, client }) => {
  const foundBusiness = await BusinessModel(db).findOne({ _id: client?.business });

  if (!foundBusiness || !foundBusiness.stripeAccountId) {
    throw ApolloError('BadRequest', "Business is not Configured to accept payments.")
  }

  // TODO: GET FROM INPUT payment id and checkout id
  // information about the Payment
  // information abpout the Checkout

  try {
    const intentObject = {
      amount: 1000,
      currency: "USD",
      locale: locale,
      businessId: foundBusiness._id,
      checkoutId: "input.checkoutId",
      stripeAccount: foundBusiness.stripeAccountId,
    }

    console.log("generatePaymentIntent", intentObject)
    const paymentIntent = await createPaymentIntent(intentObject)

    console.log("generatePaymentIntent reponse", paymentIntent)

    return ({
      clientSecret: paymentIntent.client_secret,
      paymentIntent: paymentIntent.id,
      currency: paymentIntent.currency,
      amount: paymentIntent.amount,
    });
  } catch (err) {
    console.log("generatePaymentIntent error", err)
    throw ApolloError('BadRequest', `Error creating paymentIntent: ${err}`);
  }


}

const connectExpressPayment: MutationResolvers["connectExpressPayment"] = async (parent, { input },
  { db, user, locale }) => {
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
      businessId: foundBusiness._id,
      locale
    })

    foundBusiness.stripeAccountId = accountId;
    await foundBusiness.save();
  }

  const accountLink = await stripeOnboard(accountId, locale);

  return accountLink.url
}

export const PaymentMutation = {
  connectExpressPayment,
  generatePaymentIntent
}