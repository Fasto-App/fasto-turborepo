import { OrderDetailModel } from "../../../models";
import { PaymentModel } from "../../../models/payment";
import { Context } from "../types";

const getPaymentsByCheckout = async (parent: any, args: any, { db }: Context, info: any) => {
  // parent is the checkout

  const Payment = PaymentModel(db);
  const payments = await Payment.find({ checkout: parent._id });
  return payments
}

const getOrdersByCheckout = async (parent: any, args: any, { db }: Context, info: any) => {
  const Order = OrderDetailModel(db);
  const orders = await Order.find({ _id: { $in: parent.orders } });

  return orders
}

export const CheckoutResolver = {
  payments: getPaymentsByCheckout,
  orders: getOrdersByCheckout,
}

