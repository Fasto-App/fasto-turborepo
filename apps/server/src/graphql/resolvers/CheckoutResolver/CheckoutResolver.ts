import { PaymentModel } from "../../../models/payment";
import { Context } from "../types";

export const getPaymentsByCheckout = async (parent: any, args: any, { db }: Context, info: any) => {
  // parent is the checkout

  const Payment = PaymentModel(db);
  const payments = await Payment.find({ checkout: parent._id });
  return payments
}

export const CheckoutResolver = {
  payments: getPaymentsByCheckout,
}

