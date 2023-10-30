import { MutationResolvers } from "../../../generated/graphql";
import { AddressModel, BusinessModel, OrderDetailModel, ProductModel, RequestModel, TabModel, TableModel, UserModel } from "../../../models";
import { Checkout, CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { createPaymentIntent, stripe, stripeAuthorize, stripeOnboard } from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { getCountry, updateProductQuantity } from "../helpers/helpers";

const generatePaymentIntent: MutationResolvers["generatePaymentIntent"] = async (parent, { input },
  { db, user, locale, client }) => {

  if (!client) throw ApolloError('Unauthorized', "Not Authorized. Please login again.")

  const foundBusiness = await BusinessModel(db).findOne({ _id: client?.business });

  if (!foundBusiness || !foundBusiness.stripeAccountId) {
    throw ApolloError('BadRequest', "Business is not Configured to accept payments.")
  }

  // from the business, get the address
  const foundAddress = await AddressModel(db).findOne({ _id: foundBusiness.address })

  // if no country, throw an error asking to set the address first
  // TODO: Delete all the addresses and make country standard
  if (!foundAddress?.country) {
    throw ApolloError('BadRequest', "Please set the address first.")
  }

  const foundPayment = await PaymentModel(db).findOne({ _id: input.payment })
  if (!foundPayment) {
    throw ApolloError('BadRequest', "Payment not found.")
  }

  const foundCheckout = await CheckoutModel(db).findOne({ _id: foundPayment.checkout })
  if (!foundCheckout) {
    throw ApolloError('BadRequest', "Checkout not found.")
  }

  // create a description for the payment intent
  const description = `Payment for ${foundBusiness.name} - Checkout ID: ${foundCheckout._id}; Payment ID: ${foundPayment._id}`;

  try {
    const paymentIntent = await createPaymentIntent({
      amount: foundPayment.amount,
      businessId: foundBusiness._id,
      checkoutId: foundCheckout._id,
      paymentId: foundPayment._id,
      stripeAccount: foundBusiness.stripeAccountId,
      description,
      country: foundAddress?.country,
    })

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
  const Address = AddressModel(db);

  const foundBusiness = await Business.findOne({ _id: user?.business }).populate("address");
  const foundUser = await User.findOne({ _id: user?._id })

  if (!foundBusiness || !foundUser) {
    throw ApolloError('Unauthorized', "Not Authorized. Please login again.")
  }

  const country = await getCountry({ db, business: foundBusiness._id })
  if (!country) throw ApolloError("Unauthorized", "You Need a Country")

  let accountId = foundBusiness.stripeAccountId;

  if (!accountId) {

    accountId = await stripeAuthorize({
      firstName: foundUser.name as string,
      email: foundBusiness.email,
      businessName: foundBusiness.name,
      country,
      business_type: input.business_type,
      businessId: foundBusiness._id,
      locale
    })

    foundBusiness.stripeAccountId = accountId;
    await foundBusiness.save();
  }

  const accountLink = await stripeOnboard(accountId, locale, country);

  return accountLink.url
}

const generateStripePayout: MutationResolvers["generateStripePayout"] = async (parent, _,
  { db, user }) => {
  const Address = AddressModel(db);

  const foundBusiness = await BusinessModel(db).findOne({ _id: user?.business });

  if (!foundBusiness?.stripeAccountId) throw ApolloError('BadRequest', "Stripe Account not found")

  const country = await getCountry({ db, business: foundBusiness._id })
  if (!country) throw ApolloError("Unauthorized", "You Need a Country")
  // Fetch the account balance to determine the available funds
  const balance = await stripe(country).balance.retrieve({
    stripeAccount: foundBusiness?.stripeAccountId,
  });

  // (Note: there is one balance for each currency used in your application)
  // TODO: Handle multiple currencies, for now we just use the first one
  const { amount, currency } = balance.available[0];

  if (amount <= 0) {
    throw ApolloError('BadRequest', "Not enough funds to payout.")
  }

  await stripe(country).payouts.create({
    amount: amount,
    currency: currency,
    statement_descriptor: "Fasto App",
  }, { stripeAccount: foundBusiness?.stripeAccountId, });

  return true
}

const confirmPayment: MutationResolvers['confirmPayment'] = async (
  _parent, { input }, { db }) => {
  const foundPayment = await PaymentModel(db).findById(input.payment)
  if (!foundPayment) throw ApolloError('BadRequest', "Payment not found.")

  const foundCheckout = await CheckoutModel(db).findById(foundPayment?.checkout)
  if (!foundCheckout) throw ApolloError('BadRequest', "Payment not found.")

  const foundTab = await TabModel(db).findById(foundCheckout.tab)
  if (!foundTab) throw ApolloError('BadRequest', 'Tab not found')

  foundPayment.paid = true;
  await foundPayment.save()

  foundCheckout.totalPaid += foundPayment.amount
  console.log("foundCheckout.totalPaid", foundCheckout.totalPaid)
  console.log("foundCheckout.total", foundCheckout.total)

  if (foundCheckout.totalPaid >= foundCheckout.total) {

    if (foundTab?.table) {
      const foundTable = await TableModel(db).findByIdAndUpdate(foundTab.table)
      if (!foundTable) throw ApolloError('BadRequest', 'Table not found')

      foundTable.status = "Available"
      foundTable.tab = undefined
      await foundTable.save()
    }

    foundTab.status = "Closed"
    await foundTab.save()

    foundCheckout.status = "Paid"
    foundCheckout.paid = true

    await updateProductQuantity(foundCheckout, db)

    // update all the requests associated with this tab
    const foundRequests = await RequestModel(db).find({ tab: foundTab?._id })
    if (foundRequests.length > 0) {
      const savePromises = foundRequests.map((request) => {
        request.status = "Completed"
        return request.save()
      });

      await Promise.all(savePromises);

      console.log("savePromises", savePromises)
    }
  }

  await foundCheckout.save()
  return true
}

export const PaymentMutation = {
  connectExpressPayment,
  generatePaymentIntent,
  generateStripePayout,
  confirmPayment
}