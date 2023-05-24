
import { getPercentageOfValue, paymentSchema, PaymentType } from "app-helpers";
import { OrderDetailModel, TableModel, TabModel, UserModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { MutationResolvers } from "../../../generated/graphql";

export const makeCheckoutPayment = async (parent: any, args: { input: PaymentType }, { db }: Context, info: any) => {

  console.log("makeCheckoutPayment", args.input)


  const { amount, patron, paymentMethod, tip, checkout, splitType, discount } = paymentSchema.parse(args.input);
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);
  const Tab = TabModel(db);
  const Table = TableModel(db);
  const foundCheckout = await Checkout.findById(checkout);

  if (!foundCheckout) throw ApolloError('BadRequest')

  if (foundCheckout?.discount == undefined) {
    foundCheckout.discount = discount
    foundCheckout.total = foundCheckout.subTotal - getPercentageOfValue(foundCheckout.subTotal, discount)
    await foundCheckout.save()
  }

  if (foundCheckout?.tip === undefined) {
    foundCheckout.tip = tip
    foundCheckout.total = foundCheckout.subTotal + getPercentageOfValue(foundCheckout.subTotal, tip)
    await foundCheckout.save()
  }

  async function verifiePatron(patron: string) {
    const foundUser = await User.findById(patron);
    // this will fails because I changed the user model
    // I need to perform a payment to then enforce the user to be part of the checkout
    return foundUser ?? patron
  }

  async function updateTabAndTable() {
    const foundTab = await Tab.findByIdAndUpdate(foundCheckout?.tab, {
      status: "Closed",
    }, { new: true })

    await Table.findByIdAndUpdate(foundTab?.table, {
      status: "Available",
    }, { new: true })
  }

  switch (foundCheckout.status) {
    case "PartiallyPaid":
    case "Pending":

      if (foundCheckout?.splitType && foundCheckout?.splitType !== splitType) {
        throw ApolloError('BadRequest', 'Split type does not match the checkout split type')
      }
      // payment will only be valid if enough money to pay the bill
      // or if not enough, but payment is intended to be a split of the check
      if (splitType) {
        const foundPatron = await verifiePatron(patron);

        const payment = await Payment.create({
          amount,
          paymentMethod,
          splitType,
          tip,
          discount,
          patron: typeof foundPatron === "string" ? foundPatron : foundPatron?._id,
        })

        foundCheckout.totalPaid = foundCheckout?.totalPaid + amount
        foundCheckout.status = "PartiallyPaid"
        foundCheckout.splitType = splitType
        foundCheckout.payments = [...(foundCheckout?.payments ?? []), payment._id]

        if (foundCheckout?.totalPaid >= foundCheckout?.total) {
          foundCheckout.status = "Paid"
          foundCheckout.paid = true

          await updateTabAndTable()
        }

        await foundCheckout?.save();

        return foundCheckout
      }
      // the payment is not a split of the check
      // so it will only be valid if the amount is equal to the total
      if (amount < foundCheckout?.total) {
        throw ApolloError('BadRequest', 'Payment amount is less than the total amount')
      }

      const foundPatron = await verifiePatron(patron);

      console.log("before creating Payment")

      const payment = await Payment.create({
        amount,
        tip,
        discount,
        patron: typeof foundPatron === "string" ? foundPatron : foundPatron?._id,
        paymentMethod,
      })

      const savedCheckout = await foundCheckout.update({
        totalPaid: foundCheckout?.totalPaid + amount,
        totalTip: foundCheckout?.tip ?? 0 + (tip ?? 0),
        status: "Paid",
        paid: true,
        payments: [...(foundCheckout?.payments ?? []), payment._id],
      }, { new: true })

      await updateTabAndTable()

      return savedCheckout


    case "Paid":
    case "Cancelled":
    case "Refunded":
      return foundCheckout

    default:
      throw ApolloError('BadRequest')
  }
};


// todo: implement this
const customerRequestCheckoutPayment = async (parent: any, args: any, { db }: Context, info: any) => {
  // get all the information from the client and validate it
  // 
}

// @ts-ignore
const customerRequestSplit: MutationResolvers["customerRequestSplit"] = async (parent, { input }, { db }) => {
  const Checkout = CheckoutModel(db);
  const Order = OrderDetailModel(db);
  const Payment = PaymentModel(db);
  const foundCheckout = await Checkout.findById(input.checkout)

  if (!foundCheckout) throw ApolloError('BadRequest')
  foundCheckout.orders // populate all the orders


  if (foundCheckout?.splitType) throw ApolloError('BadRequest', 'Checkout is already split')

  foundCheckout.splitType = input.splitType
  foundCheckout.tip = input.tip
  foundCheckout.total = foundCheckout.subTotal + getPercentageOfValue(foundCheckout.subTotal, input.tip)

  await foundCheckout.save()

  switch (input.splitType) {
    case "Equally":
      const paymentAmount = foundCheckout.total / input.selectedUsers.length

      // for each user, create a payment
      for (const user of input.selectedUsers) {
        const payment = await Payment.create({
          amount: paymentAmount,
          patron: user,
          splitType: input.splitType,
          tip: input.tip,
          checkout: foundCheckout._id
        })

        foundCheckout.payments?.push(payment._id)
      }

      await foundCheckout.save()

      break;
    case "ByPatron":
      const orders = await Order.find({ _id: { $in: foundCheckout.orders } })
      // separate the orders by user and create a payment for each user

      console.log("ByPatron")
      console.log(input.selectedUsers)
      break;
    case "Custom":
      console.log("Custom")
      console.log(input.customSplit)
      break;

    default:
      throw ApolloError('BadRequest')
  }

  return foundCheckout

}

export const CheckoutResolverMutation = {
  makeCheckoutPayment,
  customerRequestSplit
}