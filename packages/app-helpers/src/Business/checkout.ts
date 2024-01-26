import { typedKeys } from "../utils";

export const CheckoutStatus = {
	Pending: "Pending",
	Paid: "Paid",
	Cancelled: "Cancelled",
	PartiallyPaid: "Partially Paid",
	Refunded: "Refunded",
} as const;

export const splitTypes = {
	Equally: "Equally",
	ByPatron: "By Patron",
	Custom: "Custom",
	Full: "Full",
} as const;

const paymentOptions = {
	Cash: "Cash",
	CreditCard: "Credit Card",
	DebitCard: "Debit Card",
	MobileWallet: "Mobile Wallet",
	OnlinePayment: "Online Payment",
	ContactlessPayment: "Contactless Payment",
	GiftCard: "Gift Card",
	SplitPayment: "Split Payment",
	Check: "Check",
	InAppPayment: "In-App Payment",
} as const;

export type SplitType = keyof typeof splitTypes;
export const splitType = ["ByPatron", "Equally", "Custom", "Full"] as const;

export type CheckoutStatusKeys = keyof typeof CheckoutStatus;

export type PaymentOption = keyof typeof paymentOptions;
