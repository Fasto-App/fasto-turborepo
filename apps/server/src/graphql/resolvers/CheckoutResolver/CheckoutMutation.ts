
import { paymentSchema, PaymentType } from "app-helpers";
import { TableModel, TabModel, UserModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { SessionModel } from "../../../models/session";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

export const makeCheckoutPayment = async (parent: any, args: { input: PaymentType }, { db }: Context, info: any) => {
  // at some point, we need to add a check to make sure that the payment is not being made by a patron that is not part of the checkout

  // when the payment is made, we need to close the tab and free the Table


  const { amount, patron, paymentMethod, tip, _id, splitType } = paymentSchema.parse(args.input);
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);
  const Session = SessionModel(db);
  const foundCheckout = await Checkout.findById(_id);
  const Tab = TabModel(db);
  const Table = TableModel(db);

  async function verifiePatron(patron?: string) {
    if (!patron) return null

    try {
      const foundSession = await Session.findById(patron);

      return foundSession
    } catch (error) {
      console.log("error", error)
      return await User.findById(patron);
    }
  }

  async function updateTabAndTable() {
    const foundTab = Tab.findById(foundCheckout?.tab);
    const foundTable = Table.findById(foundTab?.table);

    foundTable?.update({
      status: "Available",
    })

    foundTab?.update({
      status: "Closed",
    })
  }

  if (!foundCheckout) throw ApolloError('BadRequest')

  console.log("foundCheckout", foundCheckout)

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
          patron,
          paymentMethod,
          splitType,
          tip,
          ...(foundPatron && { patron: foundPatron._id }),
        })

        foundCheckout?.payments?.push(payment._id);

        await foundCheckout.update({
          totalPaid: foundCheckout?.totalPaid + amount,
          totalTip: foundCheckout?.tip ?? 0 + (tip ?? 0),
          status: "PartiallyPaid",
          splitType,
        }, { new: true })

        if (foundCheckout?.totalPaid >= foundCheckout?.total) {
          foundCheckout.status = "Paid"
          foundCheckout.paid = true

          await updateTabAndTable()
        }

        return await foundCheckout?.save();
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
        ...(foundPatron && { patron: foundPatron._id }),
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