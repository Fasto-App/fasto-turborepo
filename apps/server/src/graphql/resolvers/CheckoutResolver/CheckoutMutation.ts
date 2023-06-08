
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

// @ts-ignore
const customerRequestPayFull: MutationResolvers["customerRequestPayFull"] = async (parent, { input }, { db }) => {
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);

  const foundCheckout = await Checkout.findById(input.checkout)
  const foundUser = await User.findById(input.patron)

  if (!foundCheckout || !foundUser) throw ApolloError('BadRequest')
  if (foundCheckout?.splitType) throw ApolloError('BadRequest', 'Checkout is already splited')

  foundCheckout.splitType = "Full"
  foundCheckout.tip = input.tip
  foundCheckout.total = foundCheckout.subTotal + getPercentageOfValue(foundCheckout.subTotal, input.tip)

  const payment = await Payment.create({
    checkout: foundCheckout._id,
    amount: foundCheckout?.total,
    patron: foundUser._id,
    tip: foundCheckout?.tip,
    discount: foundCheckout?.discount,
    splitType: "Full",
  })

  foundCheckout.payments = [payment._id]

  return await foundCheckout.save()
}

// TODO: implement all the other split types
// @ts-ignore
const customerRequestSplit: MutationResolvers["customerRequestSplit"] = async (parent, { input }, { db }) => {
  const Checkout = CheckoutModel(db);
  const Order = OrderDetailModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);

  const foundCheckout = await Checkout.findById(input.checkout)
  const foundUsers = await User.find({ _id: { $in: input.selectedUsers } })

  if (!foundCheckout) throw ApolloError('BadRequest')
  if (foundCheckout?.splitType) throw ApolloError('BadRequest', 'Checkout is already splited')
  if (foundUsers.length < 1) throw ApolloError('BadRequest', 'No users selected')

  const tipValue = getPercentageOfValue(foundCheckout.subTotal, input.tip)
  const absoluteTotal = foundCheckout.subTotal + tipValue

  function updateCheckout() {
    if (!foundCheckout) throw ApolloError('BadRequest', "No checkout found")

    foundCheckout.splitType = input.splitType
    foundCheckout.tip = input.tip
    foundCheckout.total = absoluteTotal
  }

  switch (input.splitType) {
    case "Equally":
      // for each user, create a payment
      for (const user of foundUsers) {
        const payment = await Payment.create({
          patron: user._id,
          amount: absoluteTotal / foundUsers.length,
          tip: input.tip,
          splitType: input.splitType,
          checkout: foundCheckout._id
        })

        foundCheckout.payments?.push(payment._id)
      }

      updateCheckout()
      await foundCheckout.save()

      break;
    case "ByPatron":
      const orders = await Order.find({ _id: { $in: foundCheckout.orders } })

      // create an object with the key and a subtotal of zero
      const selectedUsers = foundUsers.reduce((acc, user) => {
        return {
          ...acc,
          [user._id.toString()]: {
            subTotal: 0,
          }
        }
      }, {} as { [key: string]: { subTotal: number } })

      const ordersByPatron = orders.reduce((acc, order) => {
        const patron = order.user?.toString()
        const orderTotal = order.subTotal

        // or if the the patron was not selected
        if (!patron || !acc[patron]) {
          return {
            ...acc,
            tab: {
              subTotal: acc.tab?.subTotal + orderTotal,
            }
          }
        }

        return {
          ...acc,
          [patron]: {
            subTotal: (acc[patron]?.subTotal ?? 0) + orderTotal,
          }
        }
      }, { tab: { subTotal: 0 }, ...selectedUsers } as {
        [key: string]: { subTotal: number }, tab: { subTotal: number }
      })

      // take the total from tab and split it equally among the selected users
      const tipSplited = tipValue / foundUsers.length
      const tabSplited = ordersByPatron.tab.subTotal / foundUsers.length

      // for each user, create a payment
      for (const user of foundUsers) {
        const individualTotal = ordersByPatron[user._id.toString()].subTotal ?? 0

        if (individualTotal + tipSplited + tabSplited <= 0) return

        const payment = await Payment.create({
          checkout: foundCheckout._id,
          patron: user._id,
          amount: individualTotal + tipSplited + tabSplited,
          splitType: input.splitType,
          tip: input.tip,
        })

        foundCheckout.payments?.push(payment._id)
      }

      updateCheckout()
      await foundCheckout.save()

      break;
    case "Custom":
      if (!input?.customSplit || input?.customSplit?.length < 1) {
        throw ApolloError('BadRequest', 'No users selected')
      }
      // make sure that all of them togheter are equal to the total
      const total = input?.customSplit?.reduce((acc, split) => acc + (split?.amount ?? 0), 0)
      if (total !== absoluteTotal) {
        throw ApolloError('BadRequest', 'The total is not equal to the total of the checkout')
      }

      // for each user, create a payment
      for (const split of input.customSplit) {
        const payment = await Payment.create({
          checkout: foundCheckout._id,
          patron: split.patron,
          amount: split.amount,
          splitType: input.splitType,
          tip: input.tip,
        })

        foundCheckout.payments?.push(payment._id)
      }

      updateCheckout()
      return foundCheckout.save()

      break;

    default:
      throw ApolloError('BadRequest', 'Split type not supported')
  }

  return foundCheckout

}

export const CheckoutResolverMutation = {
  makeCheckoutPayment,
  customerRequestSplit,
  customerRequestPayFull,
}