
import { FIXED_POINT_FACTOR_PERCENTAGE, getPercentageOfValue, paymentSchema, PaymentType } from "app-helpers";
import { TableModel, TabModel, UserModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { SessionModel } from "../../../models/session";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

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
  console.log("foundCheckout make payment", foundCheckout)

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

        const upadatedCheckout = await foundCheckout.update({
          totalPaid: foundCheckout?.totalPaid + amount,
          status: "PartiallyPaid",
          splitType,
          payments: [...(foundCheckout?.payments ?? []), payment._id],
        }, { new: true })

        if (upadatedCheckout?.totalPaid >= foundCheckout?.total) {
          upadatedCheckout.status = "Paid"
          upadatedCheckout.paid = true

          await updateTabAndTable()
        }

        const updatedCheckout = await upadatedCheckout?.save();
        const payments = await Payment.find({ _id: { $in: updatedCheckout?.payments } })

        return ({
          ...updatedCheckout,
          payments,
        })
      }
      // the payment is not a split of the check
      // so it will only be valid if the amount is equal to the total
      if (amount < foundCheckout?.total) {
        throw ApolloError('BadRequest', 'Payment amount is less than the total amount')
      }

      const foundPatron = await verifiePatron(patron);

      const payment = await Payment.create({
        amount,
        paymentMethod,
        tip,
        patron: typeof foundPatron === "string" ? foundPatron : foundPatron?._id,
      })

      foundCheckout?.payments?.push(payment._id);
      foundCheckout.update({
        totalPaid: foundCheckout?.totalPaid + amount,
        totalTip: foundCheckout?.tip ?? 0 + (tip ?? 0),
        status: "Paid",
        paid: true,
      })

      await updateTabAndTable()

      return await foundCheckout?.save();

    case "Paid":
    case "Cancelled":
    case "Refunded":
      return foundCheckout

    default:
      throw ApolloError('BadRequest')
  }
}

export const CheckoutResolverMutation = {
  makeCheckoutPayment,
}