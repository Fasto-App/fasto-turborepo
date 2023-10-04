import { useRouter } from 'next/router'
import { Center, Text, Box, Button, ScrollView } from 'native-base'
import React, { useEffect, useState } from 'react'
import { AddressElement, Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { customerRoute } from 'fasto-route';
import { parseToCurrency } from 'app-helpers';
import { useTranslation } from 'next-i18next';

// this file needs some refactoring
// too many components, 
// unnecessary prop drilling

export const PaymentScreen = () => {
  return (
    <StripeWrapper>
      <CheckoutForm />
    </StripeWrapper>
  )
}

const CheckoutForm = () => {
  const { t } = useTranslation("customerPayment")

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

    if (error) {
      setMessage(error?.message);
    }

    setIsProcessing(false);

    if (paymentIntent?.status === "succeeded") {
      router.push(RETURN_URL)
    }
  }

  return (
    <>
      <ScrollView padding={4} flex={1}>
        <PaymentElement />
        {message && <Text color={"error.500"} fontSize={"lg"}>{message}</Text>}
      </ScrollView>
      <Center p={"4"}>
        <Button
          w={"300"}
          onPress={handlePayment}
          isDisabled={!stripe || !elements || !paymentId}
          isLoading={isProcessing}
          _text={{ bold: true }}
          fontSize={"lg"}
        >
          {
            `${t("payNow")} ${isNaN(Number(amount)) ?
              "" : parseToCurrency(Number(amount))}`}
        </Button>
      </Center>
    </>
  )
}

const stripePromiseBR = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY_BRAZIL || "");
const stripePromiseUS = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");
const stripePromise = (country: string) => country === "US" ? stripePromiseUS : stripePromiseBR;

export const StripeWrapper: React.FC = ({ children }) => {
  const router = useRouter()
  const { clientSecret, businessId, checkoutId, country } = router.query

  useEffect(() => {
    if (!clientSecret) {
      router.back()
    }
  }, [businessId, checkoutId, clientSecret, router])

  if (!clientSecret || !country) {
    return <Text textAlign={"center"} fontSize={"lg"}>
      No Client Secret, nor Country
    </Text>
  }

  return (
    <Elements
      stripe={stripePromise(typeof country === "string" ? country : country[0])}
      options={{ clientSecret: typeof clientSecret === "string" ? clientSecret : clientSecret[0] }}>
      {children}
    </Elements>
  )
}