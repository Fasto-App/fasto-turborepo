import { MutationResolvers } from "../../../generated/graphql";
import {
	AddressModel,
	BusinessModel,
	RequestModel,
	TabModel,
	TableModel,
	UserModel,
} from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { PaymentModel } from "../../../models/payment";
import {
	createPaymentIntent,
	stripe,
	stripeAuthorize,
	stripeOnboard,
} from "../../../stripe";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { getCountry, updateProductQuantity } from "../helpers/helpers";

const generatePaymentIntent: MutationResolvers["generatePaymentIntent"] =
	async (parent, { input }, { db, client }) => {
		if (!client)
			throw ApolloError(
				new Error("Not Authorized. Please login again."),
				"Unauthorized",
			);

		const foundBusiness = await BusinessModel(db).findOne({
			_id: client?.business,
		});

		if (!foundBusiness || !foundBusiness.stripeAccountId) {
			throw ApolloError(
				new Error("Business is not Configured to accept payments."),
				"BadRequest",
			);
		}

		const foundPayment = await PaymentModel(db).findOne({ _id: input.payment });
		if (!foundPayment) {
			throw ApolloError(new Error("Payment not found."), "BadRequest");
		}

		const foundCheckout = await CheckoutModel(db).findOne({
			_id: foundPayment.checkout,
		});
		if (!foundCheckout) {
			throw ApolloError(new Error("Checkout not found."), "BadRequest");
		}

		// create a description for the payment intent
		const description = `Payment for ${foundBusiness.name} - Checkout ID: ${foundCheckout._id}; Payment ID: ${foundPayment._id}; stripeAccount: ${foundBusiness.stripeAccountId}`;

		try {
			const paymentIntent = await createPaymentIntent({
				amount: foundPayment.amount,
				businessId: foundBusiness._id,
				checkoutId: foundCheckout._id,
				paymentId: foundPayment._id,
				serviceFee: foundPayment.serviceFee,
				stripeAccount: foundBusiness.stripeAccountId,
				description,
				country: foundBusiness?.country,
			});

			return {
				clientSecret: paymentIntent.client_secret,
				paymentIntent: paymentIntent.id,
				currency: paymentIntent.currency,
				amount: paymentIntent.amount,
			};
		} catch (err) {
			throw ApolloError(err as Error, "InternalServerError");
		}
	};

const connectExpressPayment: MutationResolvers["connectExpressPayment"] =
	async (parent, { input }, { db, user, locale }) => {
		const Business = BusinessModel(db);
		const User = UserModel(db);
		const Address = AddressModel(db);

		const foundBusiness = await Business.findOne({
			_id: user?.business,
		}).populate("address");
		const foundUser = await User.findOne({ _id: user?._id });

		if (!foundBusiness || !foundUser) {
			throw ApolloError(
				new Error("Not Authorized. Please login again."),
				"Unauthorized",
			);
		}

		const country = await getCountry({ db, business: foundBusiness._id });
		if (!country)
			throw ApolloError(new Error("You Need a Country"), "Unauthorized");

		let accountId = foundBusiness.stripeAccountId;

		if (!accountId) {
			accountId = await stripeAuthorize({
				firstName: foundUser.name as string,
				email: foundBusiness.email,
				businessName: foundBusiness.name,
				country,
				business_type: input.business_type,
				businessId: foundBusiness._id,
				locale,
			});

			foundBusiness.stripeAccountId = accountId;
			await foundBusiness.save();
		}

		const accountLink = await stripeOnboard(accountId, locale, country);

		return accountLink.url;
	};

const generateStripePayout: MutationResolvers["generateStripePayout"] = async (
	parent,
	_,
	{ db, user },
) => {
	const Address = AddressModel(db);

	const foundBusiness = await BusinessModel(db).findOne({
		_id: user?.business,
	});

	if (!foundBusiness?.stripeAccountId)
		throw ApolloError(new Error("Stripe Account not found"), "BadRequest");

	const country = await getCountry({ db, business: foundBusiness._id });
	if (!country)
		throw ApolloError(new Error("You Need a Country"), "Unauthorized");
	// Fetch the account balance to determine the available funds
	const balance = await stripe(country).balance.retrieve({
		stripeAccount: foundBusiness?.stripeAccountId,
	});

	// (Note: there is one balance for each currency used in your application)
	// TODO: Handle multiple currencies, for now we just use the first one
	const { amount, currency } = balance.available[0];

	if (amount <= 0) {
		throw ApolloError(new Error("Not enough funds to payout."), "BadRequest");
	}

	await stripe(country).payouts.create(
		{
			amount: amount,
			currency: currency,
			statement_descriptor: "Fasto App",
		},
		{ stripeAccount: foundBusiness?.stripeAccountId },
	);

	return true;
};

const confirmPayment: MutationResolvers["confirmPayment"] = async (
	_parent,
	{ input },
	{ db },
) => {
	const foundPayment = await PaymentModel(db).findById(input.payment);
	if (!foundPayment)
		throw ApolloError(new Error("Payment not found."), "BadRequest");

	const foundCheckout = await CheckoutModel(db).findById(
		foundPayment?.checkout,
	);
	if (!foundCheckout)
		throw ApolloError(new Error("Checkout not found."), "BadRequest");

	const foundTab = await TabModel(db).findById(foundCheckout.tab);
	if (!foundTab) throw ApolloError(new Error("Tab not found"), "BadRequest");

	foundPayment.paid = true;
	await foundPayment.save();

	foundCheckout.totalPaid += foundPayment.amount;

	if (foundCheckout.totalPaid >= foundCheckout.total) {
		if (foundTab?.table) {
			const foundTable = await TableModel(db).findByIdAndUpdate(foundTab.table);
			if (!foundTable)
				throw ApolloError(new Error("Table not found"), "BadRequest");

			foundTable.status = "Available";
			foundTable.tab = undefined;
			await foundTable.save();
		}

		foundTab.status = "Closed";
		await foundTab.save();

		foundCheckout.status = "Paid";
		foundCheckout.paid = true;

		await updateProductQuantity(foundCheckout, db);

		// update all the requests associated with this tab
		const foundRequests = await RequestModel(db).find({ tab: foundTab?._id });
		if (foundRequests.length > 0) {
			const savePromises = foundRequests.map((request) => {
				request.status = "Completed";
				return request.save();
			});

			await Promise.all(savePromises);
		}
	}

	await foundCheckout.save();
	return true;
};

export const PaymentMutation = {
	connectExpressPayment,
	generatePaymentIntent,
	generateStripePayout,
	confirmPayment,
};
