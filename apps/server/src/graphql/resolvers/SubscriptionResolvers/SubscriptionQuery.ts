import { stripe } from "../../../stripe";
const getSubscriptionPrices = async () => {

  // get the country from the client
  const pricesResponse = await stripe("US").prices.list({
    limit: 3,
    expand: ['data.product'],
  });

  return pricesResponse.data.reverse()
}


export const SubscriptionQuery = {
  getSubscriptionPrices,
}