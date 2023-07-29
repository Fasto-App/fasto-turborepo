import { MutationResolvers } from "../../../generated/graphql";
import { BusinessModel, UserModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { createPaymentIntent, stripeAuthorize, stripeOnboard } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

const generatePaymentIntent: MutationResolvers["generatePaymentIntent"] = async (parent, { input },
  { db, user, locale, client }) => {

  if (!client) throw ApolloError('Unauthorized', "Not Authorized. Please login again.")

  const foundBusiness = await BusinessModel(db).findOne({ _id: client?.business });

  if (!foundBusiness || !foundBusiness.stripeAccountId) {
    throw ApolloError('BadRequest', "Business is not Configured to accept payments.")
  }

  const foundPayment = await PaymentModel(db).findOne({ _id: input.payment })
  if (!foundPayment) {
    throw ApolloError('BadRequest', "Payment not found.")
  }

  const foundCheckout = await CheckoutModel(db).findOne({ _id: foundPayment.checkout })
  if (!foundCheckout) {
    throw ApolloError('BadRequest', "Checkout not found.")
  }
  // TODO: GET FROM INPUT payment id and checkout id

  try {
    const intentObject = {
      amount: foundPayment.amount,
      currency: "USD",
      locale: locale,
      businessId: foundBusiness._id,
      checkoutId: foundCheckout._id,
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