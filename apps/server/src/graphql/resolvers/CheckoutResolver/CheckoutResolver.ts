import { OrderDetailModel } from "../../../models";
import { PaymentModel } from "../../../models/payment";
import { Context } from "../types";

const getPaymentsByCheckout = async (
	parent: any,
	args: any,
	{ db }: Context,
	info: any,
) => {
	const Payment = PaymentModel(db);
	return await Payment.find({ _id: { $in: parent.payments } });
};

const getOrdersByCheckout = async (
	parent: any,
	args: any,
	{ db }: Context,
	info: any,
) => {
	const Order = OrderDetailModel(db);
	return await Order.find({ _id: { $in: parent.orders } });
};

export const CheckoutResolver = {
	payments: getPaymentsByCheckout,
	orders: getOrdersByCheckout,
};
