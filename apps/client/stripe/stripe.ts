import { loadStripe } from "@stripe/stripe-js";

const stripePromiseBR = loadStripe(
	process.env.STRIPE_PUBLISHABLE_KEY_BRAZIL || "",
);
const stripePromiseUS = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");
export const stripePromise = (country: string) =>
	country === "US" ? stripePromiseUS : stripePromiseBR;
