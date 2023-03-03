import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import { Context } from "../types";

export const getCheckoutByID = async (parent: any, args: any, { db }: Context, info: any) => {
  const Checkout = CheckoutModel(db);
  const Payment = PaymentModel(db);
  const checkout = await Checkout.findById(args.input._id);
  const foundPayments = await Payment.find({ _id: { $in: checkout?.payments } })

  return {
    ...checkout?.toObject(),
    payments: foundPayments,
  };
}

const CheckoutResolverQuery = {
  getCheckoutByID,
}

export {
  CheckoutResolverQuery,
}