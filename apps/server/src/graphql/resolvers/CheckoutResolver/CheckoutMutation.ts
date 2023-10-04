
import { getPercentageOfValue, paymentSchema, PaymentType } from "app-helpers";
import { BusinessModel, OrderDetailModel, ProductModel, RequestModel, TableModel, TabModel, UserModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { MutationResolvers } from "../../../generated/graphql";
import { updateProductQuantity } from "../helpers/helpers";

// @ts-ignore
const makeCheckoutPayment: MutationResolvers["makeCheckoutPayment"] = async (parent, { input }, { db }) => {
  console.log("makeCheckoutPayment", input)
  // make the payment, set the payment to true and update the checkout
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const Tab = TabModel(db);
  const Table = TableModel(db);
  const Request = RequestModel(db);

  const foundPayment = await Payment.findById(input.payment)
  const foundCheckout = await Checkout.findById(input.checkout)

  if (!foundPayment || !foundCheckout) throw ApolloError('BadRequest')

  foundPayment.paid = true

  foundCheckout.totalPaid = foundCheckout.totalPaid + foundPayment.amount

  // If the check is ready to be closed, update the value of: Table, Tab, Checkout, and Requests
  if (foundCheckout.totalPaid >= foundCheckout.total) {
    const foundTab = await Tab.findById(foundCheckout.tab)
    if (!foundTab) throw ApolloError('BadRequest', 'Tab not found')

    if (foundTab?.table) {
      const foundTable = await Table.findByIdAndUpdate(foundTab.table)
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
    const foundRequests = await Request.find({ tab: foundTab?._id })
    if (foundRequests.length > 0) {
      const savePromises = foundRequests.map((request) => {
        request.status = "Completed"
        return request.save()
      });

      await Promise.all(savePromises);
    }
  }

  await Promise.all([foundPayment.save(), foundCheckout.save()])

  return foundCheckout
}

// TODO I will probably going to have to re-do this
// @ts-ignore
const makeCheckoutFullPayment: MutationResolvers["makeCheckoutFullPayment"] = async (parent, { input }, { db }) => {
  console.log("makeCheckoutFullPayment", input)

  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);
  const Tab = TabModel(db);
  const Table = TableModel(db);
  const Request = RequestModel(db);

  const { patron, paymentMethod, tip, checkout, discount } = paymentSchema.parse(input);

  const foundCheckout = await Checkout.findById(checkout);

  if (!foundCheckout) throw ApolloError('BadRequest', 'Checkout not found')
  if (!foundCheckout?.tab) throw ApolloError('BadRequest', 'Tab not found')
  if (foundCheckout.splitType) throw ApolloError('BadRequest', 'Split type is already set')

  if (foundCheckout?.discount === undefined && discount) {
    foundCheckout.discount = discount
    foundCheckout.total = foundCheckout.subTotal - getPercentageOfValue(foundCheckout.subTotal, discount)
    await foundCheckout.save()
  }

  if (foundCheckout?.tip === undefined && tip) {
    foundCheckout.tip = tip
    foundCheckout.total = foundCheckout.total + getPercentageOfValue(foundCheckout.subTotal, tip)
    await foundCheckout.save()
  }

  async function verifiePatron(patron: string) {
    const foundUser = await User.findById(patron);

    if (!foundUser) throw ApolloError('BadRequest', 'User not found')
    return foundUser
  }

  async function updateTabTableAndRequests() {
    const foundTab = await Tab.findByIdAndUpdate(foundCheckout?.tab, {
      status: "Closed",
    }, { new: true })

    if (foundTab?.table) {
      const foundTable = await Table.findByIdAndUpdate(foundTab.table)
      if (!foundTable) throw ApolloError('BadRequest', 'Table not found')

      foundTable.status = "Available"
      foundTable.tab = undefined
      await foundTable.save()
    }

    // update all the requests associated with this tab
    const foundRequests = await Request.find({ tab: foundTab?._id })

    if (foundRequests.length > 0) {
      const savePromises = foundRequests.map((request) => {
        request.status = "Completed"
        return request.save()
      });

      await Promise.all(savePromises);
    }
  }

  switch (foundCheckout.status) {
    case "PartiallyPaid":
    case "Pending":
      const foundPatron = await verifiePatron(patron);

      // from the found checkout, create the payment method and update the checkout
      const payment = await Payment.create({
        checkout: foundCheckout._id,
        amount: foundCheckout.total,
        tip,
        discount,
        patron: typeof foundPatron === "string" ? foundPatron : foundPatron?._id,
        paymentMethod,
        paid: true,
        splitType: "Full",
      })

      foundCheckout.totalPaid = foundCheckout.totalPaid + payment.amount
      foundCheckout.status = "Paid"
      foundCheckout.paid = true
      foundCheckout.payments = [payment._id]
      foundCheckout.splitType = "Full"

      await updateProductQuantity(foundCheckout, db)

      await updateTabTableAndRequests()

      return await foundCheckout.save()
    case "Paid":
    case "Cancelled":
    case "Refunded":
      return foundCheckout

    default:
      throw ApolloError('BadRequest')
  }
};

// @ts-ignore
const customerRequestPayFull: MutationResolvers["customerRequestPayFull"] = async (parent, { input }, { db, client, locale }) => {
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);
  const Business = BusinessModel(db);

  const foundCheckout = await Checkout.findById(input.checkout)
  const foundUser = await User.findById(input.patron)
  const foundBusiness = await Business.findById(client?.business)

  if (!foundCheckout || !foundUser || !foundBusiness?.stripeAccountId) throw ApolloError('BadRequest')
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

// @ts-ignore
const customerRequestSplit: MutationResolvers["customerRequestSplit"] = async (parent, { input }, { db, client, locale }) => {
  const Checkout = CheckoutModel(db);
  const Order = OrderDetailModel(db);
  const Payment = PaymentModel(db);
  const User = UserModel(db);
  const Business = BusinessModel(db);

  const foundCheckout = await Checkout.findById(input.checkout)
  const foundUsers = await User.find({ _id: { $in: input.selectedUsers } })
  const foundBusiness = await Business.findById(client?.business)

  // TODO: this function is being used for both business and customer
  if (!foundBusiness?.stripeAccountId) throw ApolloError('Unauthorized', 'Business not configured to accept payments')
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
    default:
      throw ApolloError('BadRequest', 'Split type not supported')
  }

  return foundCheckout
}

export const CheckoutResolverMutation = {
  makeCheckoutFullPayment,
  customerRequestSplit,
  customerRequestPayFull,
  makeCheckoutPayment,
}