import { useRouter } from 'next/router'
import { Center, Text, Box, Button } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { customerRoute } from 'fasto-route';

// this file needs some refactoring
// too many components, 
// unnecessary prop drilling

export const PaymentScreen = () => {
  return (
    <StripeWrapper>
      <Center height={"100%"}>
        <CheckoutForm />
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

  const handlePayment = async (e: any) => {
    console.log('handlePayment')
    setIsProcessing(true);

    const RETURN_URL = `${process.env.FRONTEND_URL}${customerRoute["/customer/[businessId]/success"].
      replace("[businessId]", businessId as string)}`

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: RETURN_URL,
      },
      redirect: "if_required",
    });
    paymentIntent?.status === "succeeded" && router.push(RETURN_URL)

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
    <Box>
      <PaymentElement id="payment-element" />
      <Button
        w={"100%"}
        onPress={handlePayment}
        isDisabled={!stripe || !elements || isProcessing}
        mt={4}
        mb={2}
      >
        {isProcessing ? "Processing ... " : "Pay now"}
      </Button>
      {message && <Text color={"error.500"} fontSize={"lg"}>
        {message}
      </Text>}
    </Box>
  )
}

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");

export const StripeWrapper: React.FC = ({ children }) => {
  const router = useRouter()
  const { clientSecret, paymentIntent, businessId, checkoutId } = router.query

  useEffect(() => {
    if (!clientSecret) {
      router.back()
    }
  }, [businessId, checkoutId, clientSecret, router])

  if (!clientSecret) {
    return null
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: typeof clientSecret === "string" ?
          clientSecret : clientSecret[0]
      }}>
      {children}
    </Elements>
  )
}

