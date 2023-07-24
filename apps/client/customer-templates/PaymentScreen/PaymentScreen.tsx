import { useRouter } from 'next/router'
import { Center, Text } from 'native-base'
import React, { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Button } from 'native-base';
import { customerRoute } from 'fasto-route';

// this file needs some refactoring
// too many components, 
// unnecessary prop drilling

export const PaymentScreen = () => {
  const router = useRouter()
  const { clientSecret, paymentIntent } = router.query

  console.log('clientSecret', clientSecret)

  if (!clientSecret) {
    return null
  }

  return (
    <StripeWrapper clientSecret={typeof clientSecret === "string" ? clientSecret : clientSecret[0]}>
      <Center height={"100%"}>
        <StripePaymentElement />
      </Center>
    </StripeWrapper>
  )
}

const CheckoutForm = () => {

  const router = useRouter()
  const { clientSecret, paymentIntent, businessId } = router.query

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {

    console.log('handlePayment')

    console.log({
      stripe,
      elements
    })

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.FRONTEND_URL}${customerRoute["/customer/[businessId]/success"].
          replace("[businessId]", businessId as string)}`,
      },

    });

    console.log('error', error)
    console.log('paymentIntent', paymentIntent)
    if (error) {
      setMessage(error?.message);
    }

    setIsProcessing(false);
    // trigger some action on the server to conclude the payment
    // and redirect to success page
    // check if tab is fully paid
  }

  return (
    <form id="payment-form" onSubmit={handlePayment}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        {/* <Button
          w={"75%"}
          maxW={"250"}
          onPress={handlePayment}
          isDisabled={!stripe || !elements || isProcessing}
          mt={4}
        > */}
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
        {/* </Button> */}

      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export const StripePaymentElement = () => {


  const router = useRouter()
  const { clientSecret, paymentIntent, businessId } = router.query

  return (
    <StripeWrapper clientSecret={clientSecret as string}>
      <CheckoutForm />
      <Box h={4} />
      {/* TODO: can we user this button? Should we */}
      {/* <Button 
      w={"75%"} 
      maxW={"250"} 
      onPress={handlePayment}
       isDisabled={!stripe || !elements || isProcessing}
       >
        Pay
      </Button> */}
    </StripeWrapper>
  )
}

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");

export const StripeWrapper: React.FC<{ clientSecret: string }> = ({ children, clientSecret }) => {
  // get client secret key from server if nothing is returned
  // return null
  console.log('clientSecret', clientSecret)

  return (
    <Elements stripe={stripePromise} options={{
      clientSecret,
    }}>
      {children}
    </Elements>
  )
}

