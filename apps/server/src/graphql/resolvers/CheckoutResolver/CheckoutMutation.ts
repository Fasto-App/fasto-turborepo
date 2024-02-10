import { getPercentageOfValue, paymentSchema } from "app-helpers";
import { BusinessModel, RequestModel, TableModel, TabModel, UserModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { MutationResolvers } from "../../../generated/graphql";
import { updateProductQuantity } from "../helpers/helpers";
import { ObjectId } from "mongodb";
import { getTableTotalPerPerson, splitBillCheckForErrors, splitByPatron } from "./helpers";

// @ts-ignore
const makeCheckoutPayment: MutationResolvers["makeCheckoutPayment"] = async (parent, { input }, { db }) => {
  // make the payment, set the payment to true and update the checkout
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const Tab = TabModel(db);
  const Table = TableModel(db);
  const Request = RequestModel(db);

  const foundPayment = await Payment.findById(input.payment)
  const foundCheckout = await Checkout.findById(input.checkout)


  if (!foundPayment || !foundCheckout) throw ApolloError(new Error("No payment os checkout"), 'BadRequest')

  foundCheckout.updated_at = new Date(Date.now())
  foundPayment.paid = true

  foundCheckout.totalPaid = foundCheckout.totalPaid + foundPayment.amount

  // If the check is ready to be closed, update the value of: Table, Tab, Checkout, and Requests
  if (foundCheckout.totalPaid >= foundCheckout.total) {
    const foundTab = await Tab.findById(foundCheckout.tab)
    if (!foundTab) throw ApolloError(new Error('Tab not found'), 'BadRequest',)

    if (foundTab?.table) {
      const foundTable = await Table.findByIdAndUpdate(foundTab.table)
      if (!foundTable) throw ApolloError(new Error('Table not found'), 'BadRequest',)

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

  if (!foundCheckout) throw ApolloError(new Error('Checkout not found'), 'BadRequest',)
  if (!foundCheckout?.tab) throw ApolloError(new Error('Tab not found'), 'BadRequest',)
  if (foundCheckout.splitType) throw ApolloError(new Error('Split type is already set'), 'BadRequest',)

  foundCheckout.updated_at = new Date(Date.now())

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

    if (!foundUser) throw ApolloError(new Error('User not found'), 'BadRequest',)
    return foundUser
  }

  async function updateTabTableAndRequests() {
    const foundTab = await Tab.findByIdAndUpdate(foundCheckout?.tab, {
      status: "Closed",
    }, { new: true })

    if (foundTab?.table) {
      const foundTable = await Table.findByIdAndUpdate(foundTab.table)
      if (!foundTable) throw ApolloError(new Error('Table not found'), 'BadRequest',)

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
        amount: Math.ceil(foundCheckout.total),
        tip,
        discount,
        patron: foundPatron?._id,
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
      throw ApolloError(new Error('No Status'), 'BadRequest')
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

  if (!foundCheckout || !foundUser || !foundBusiness?.stripeAccountId) {
    throw ApolloError(new Error("Not enough data to perfom the action"), 'BadRequest')
  }

  if (foundCheckout?.splitType) throw ApolloError(new Error('Checkout is already splited'), 'BadRequest')
  // before creating the payment, we get the total of service fee
  // tipe and taxes, and then add all of the to update the total value
  const serviceFeeValue = getPercentageOfValue(foundCheckout.subTotal, foundCheckout.serviceFee || 0)
  const tipValue = getPercentageOfValue(foundCheckout.subTotal, input.tip)

  foundCheckout.splitType = "Full"
  foundCheckout.tip = input.tip
  foundCheckout.total = foundCheckout.subTotal + serviceFeeValue + tipValue

  const payment = await Payment.create({
    checkout: foundCheckout._id,
    amount: Math.ceil(foundCheckout?.total),
    patron: foundUser._id,
    tip: tipValue,
    serviceFee: Math.ceil(serviceFeeValue),
    discount: foundCheckout?.discount,
    splitType: "Full",
  })

  foundCheckout.payments = [payment._id]
  foundCheckout.updated_at = new Date(Date.now())

  return await foundCheckout.save()
}

// TODO: the problem: using this function on business and customer
// @ts-ignore
const customerRequestSplit: MutationResolvers["customerRequestSplit"] = async (parent, { input }, { db, client, user }) => {
  try {
    const { foundCheckout, foundUsers } = await splitBillCheckForErrors({
      db,
      client,
      user,
      input: {
        checkout: input.checkout,
        selectedUsers: input.selectedUsers,
      }
    })

    foundCheckout.tip = input.tip
    await foundCheckout.save()

    async function updateCheckout() {
      if (!foundCheckout) throw ApolloError(Error("No Checkout"), "BadRequest");

      const tipValue = foundCheckout.tipValue
      const serviceFeeValue = foundCheckout.serviceFeeValue
      const taxValue = foundCheckout.taxValue
      const absoluteTotal = foundCheckout.subTotal + tipValue + serviceFeeValue + taxValue

      foundCheckout.total = absoluteTotal
      foundCheckout.updated_at = new Date(Date.now())
      await foundCheckout.save()
    }

    switch (input.splitType) {
      case "Equally":
        const totalEqually = foundCheckout.total / foundUsers.length
        const tip = getPercentageOfValue(totalEqually, input.tip)
        const serviceFee = getPercentageOfValue(totalEqually, foundCheckout.serviceFee ?? 0)

        for (const user of foundUsers) {
          const payment = await PaymentModel(db).create({
            checkout: foundCheckout._id,
            patron: user._id,
            amount: Math.ceil(totalEqually),
            splitType: input.splitType,
            serviceFee: Math.ceil(serviceFee),
            tip,
          })

          foundCheckout.payments?.push(payment._id)
        }

        foundCheckout.splitType = input.splitType
        await updateCheckout()
        break;
      case "ByPatron":
        //@ts-ignore
        const ordersByPatron = await splitByPatron(db, foundCheckout, foundUsers)
        // 02. from the total of the orders, get the total of the tab with taxes, fee, and order for the table
        const tabTotalPerUser = getTableTotalPerPerson({
          subtotal: ordersByPatron.tab.subTotal,
          tip: foundCheckout.tipValue,
          serviceFee: foundCheckout.serviceFeeValue,
          users: foundUsers.length
        })

        // for each user, create a payment
        for (const user of foundUsers) {
          const individualTotal = (ordersByPatron[user._id.toString()].subTotal ?? 0) + tabTotalPerUser.total

          const payment = await PaymentModel(db).create({
            checkout: foundCheckout._id,
            amount: Math.ceil(individualTotal),
            patron: user._id,
            splitType: input.splitType,
            tip: tabTotalPerUser.tipSplited,
            serviceFee: Math.ceil(tabTotalPerUser.feeSplited)
          })

          foundCheckout.payments?.push(payment._id)
        }

        foundCheckout.splitType = input.splitType
        await updateCheckout()

        break;
      case "Custom":
        if (!input?.customSplit || input?.customSplit?.length < 1) {
          throw ApolloError(new Error('No users selected'), 'BadRequest',)
        }
        // make sure that all of them togheter are equal to the total
        const total = input?.customSplit?.reduce((acc, split) => acc + (split?.amount ?? 0), 0)

        await updateCheckout()

        if (total !== foundCheckout.total) {
          throw ApolloError(new Error('The total is not equal to the total of the checkout'), 'BadRequest',)
        }

        // for each user, create a payment
        for (const split of input.customSplit) {
          const payment = await PaymentModel(db).create({
            checkout: foundCheckout._id,
            patron: split.patron,
            amount: Math.ceil(split.amount),
            splitType: input.splitType,
            tip: input.tip,
            serviceFee: Math.ceil(foundCheckout.serviceFeeValue / input.customSplit.length),
          })

          foundCheckout.payments?.push(payment._id)
        }

        foundCheckout.splitType = input.splitType
        return await foundCheckout.save()
      default:
        throw ApolloError(new Error('Split type not supported'), 'BadRequest',)
    }

    return foundCheckout
  } catch (err) {
    throw ApolloError(err as Error, 'BadRequest',)
  }
}

// @ts-ignore
const deleteCheckoutData: MutationResolvers["deleteCheckoutData"] = async (paren, args, { db, business, user }) => {
  // is user allow to do the following?
  if (!business) throw ApolloError(new Error("No Business"), "Unauthorized")

  // find the array and delete them in batch
  try {
    const objectIds = args.ids.map((id) => new ObjectId(id));
    const result = await CheckoutModel(db).deleteMany({ _id: { $in: objectIds }, business })
    return result
  } catch (err) {
    ApolloError(err as Error, "InternalServerError")
  }
}

export const CheckoutResolverMutation = {
  makeCheckoutFullPayment,
  customerRequestSplit,
  customerRequestPayFull,
  makeCheckoutPayment,
  deleteCheckoutData
}