import { Connection } from "mongoose";
import {
	Checkout,
	OrderDetailModel,
	BusinessModel,
	CheckoutModel,
	UserModel,
	User,
} from "../../../models";
import { ClientContext, UserContext } from "../types";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

export async function splitByPatron(
	db: Connection,
	foundCheckout: Checkout & { _id: string },
	foundUsers: User & { _id: string }[],
) {
	const orders = await OrderDetailModel(db).find({
		_id: { $in: foundCheckout.orders },
	});

	const selectedUsers = foundUsers.reduce(
		(acc, user) => {
			return {
				...acc,
				[user._id.toString()]: {
					subTotal: 0,
				},
			};
		},
		{} as { [key: string]: { subTotal: number } },
	);

	return orders.reduce(
		(acc, order) => {
			const patron = order.user?.toString();
			const orderTotal = order.subTotal;

			if (!patron || !acc[patron]) {
				return {
					...acc,
					tab: {
						subTotal: acc.tab?.subTotal + orderTotal,
					},
				};
			}

			return {
				...acc,
				[patron]: {
					subTotal: (acc[patron]?.subTotal ?? 0) + orderTotal,
				},
			};
		},
		{ tab: { subTotal: 0 }, ...selectedUsers } as {
			[key: string]: { subTotal: number };
			tab: { subTotal: number };
		},
	);
}

type TotalPerPerson = {
	subtotal: number;
	tip: number;
	serviceFee: number;
	users: number;
};
export function getTableTotalPerPerson(args: TotalPerPerson) {
	const tabSplited = args.subtotal / args.users;
	const tipSplited = args.tip / args.users;
	const feeSplited = args.serviceFee / args.users;

	return {
		tabSplited,
		tipSplited,
		feeSplited,
		total: tabSplited + tipSplited + feeSplited,
	};
}

type SplitBillArgs = {
	db: Connection;
	client?: ClientContext;
	user?: UserContext;
	input: {
		checkout: string;
		selectedUsers: string[];
	};
};

export async function splitBillCheckForErrors(args: SplitBillArgs) {
	if (!args.client?.business && !args.user?.business)
		throw ApolloError(new Error("No user, nor client"), "Unauthorized");

	const foundBusiness = await BusinessModel(args.db).findById(
		args.client?.business || args.user?.business,
	);
	if (!foundBusiness?.stripeAccountId)
		throw ApolloError(
			new Error("Business not configured to accept payments"),
			"Unauthorized",
		);

	const foundCheckout = await CheckoutModel(args.db).findById(
		args.input.checkout,
	);
	if (!foundCheckout)
		throw ApolloError(new Error("No Checkout Found"), "BadRequest");

	const foundUsers = await UserModel(args.db).find({
		_id: { $in: args.input.selectedUsers },
	});

	if (foundCheckout?.splitType)
		throw ApolloError(new Error("Checkout is already splited"), "BadRequest");
	if (foundUsers.length < 1)
		throw ApolloError(new Error("No users selected"), "BadRequest");

	return {
		foundCheckout,
		foundUsers,
	};
}
