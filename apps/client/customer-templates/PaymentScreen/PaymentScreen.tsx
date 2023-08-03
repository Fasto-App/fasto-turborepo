import { useRouter } from 'next/router'
import { Center, Text, Box, Button } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { customerRoute } from 'fasto-route';
import { parseToCurrency } from 'app-helpers';
import { useConfirmPaymentMutation } from '../../gen/generated';

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

  const [confirmPayment, { loading }] = useConfirmPaymentMutation()

  const router = useRouter()
  const { businessId, amount, paymentId } = router.query

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    console.log('handlePayment')
    const RETURN_URL = `${process.env.FRONTEND_URL}${customerRoute["/customer/[businessId]/success"].
      replace("[businessId]", businessId as string)}`

    if (!stripe || !elements || !paymentId) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        return_url: RETURN_URL,
      },
      redirect: "if_required",
    });

    console.log('error', error)
    console.log('paymentIntent', paymentIntent)
    if (error) {
      setMessage(error?.message);
    }

    setIsProcessing(false);

    if (paymentIntent?.status === "succeeded") {

      confirmPayment({
        variables: {
          input: {
            payment: typeof paymentId === "string" ? paymentId : paymentId[0]
          }
        }
      })

      router.push(RETURN_URL)
    }
  }

  return (
    <Box>
      <PaymentElement id="payment-element" />
      <Button
        w={"100%"}
        onPress={handlePayment}
        isDisabled={!stripe || !elements || !paymentId || isProcessing || loading}
        mt={4}
        mb={2}
        _text={{ bold: true }}
      >
        {isProcessing || loading ? "Processing ... " :
          `Pay now ${isNaN(Number(amount)) ?
            "" : parseToCurrency(Number(amount))}`}
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
  const { clientSecret, businessId, checkoutId } = router.query

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

