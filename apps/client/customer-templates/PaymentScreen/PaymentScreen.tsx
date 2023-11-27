import { useRouter } from 'next/router'
import { Center, Text, Box, Button, ScrollView, HStack, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { customerRoute } from 'fasto-route';
import { parseToCurrency } from 'app-helpers';
import { useTranslation } from 'next-i18next';
import { stripePromise } from '../../stripe/stripe';
import { useGetPaymentInformationQuery } from '../../gen/generated';
import { PastOrdersModal } from '../CartScreen/PastOrdersModal';
import { useGetClientSession } from '../../hooks';

const Row = ({ title, value }: { title: string, value: string }) =>
  <HStack justifyContent={"space-between"}>
    <Text fontSize={"md"}>
      {title}
    </Text>
    <Text fontSize={"md"}>
      {value}
    </Text>
  </HStack>

const CheckoutForm = () => {
  const { t } = useTranslation("customerPayment")
  const { data: clientSession } = useGetClientSession()

  const router = useRouter()
  const { businessId, amount, checkoutId, paymentId } = router.query

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // get more than just this. 
  // provide a breakdown

  console.log({
    paymentId,
    checkoutId
  })

  const { data, loading, error } = useGetPaymentInformationQuery({
    skip: !paymentId,
    variables: {
      input: { payment: paymentId as string }
    },
    onError: (error) => {
      console.log("Handle Error", error)
    },
    onCompleted(data) {
      console.log(data.getPaymentInformation)
    },
  })

  // make a call to get the Payment Model 

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
      <Box alignItems={"flex-end"} px={2}>
        {!clientSession?.getClientSession.tab?.orders?.length ? null : <Button
          size="sm"
          variant="link"
          colorScheme={"info"}
          _text={{ fontSize: "lg" }}
          onPress={() => setIsModalOpen(true)}>
          {t("placedOrders", { number: clientSession?.getClientSession.tab?.orders?.length })}
        </Button>}
      </Box>
      <ScrollView padding={6} flex={1}>
        <VStack pt={2} pb={8} space={2}>
          <Row title='Subtotal' value={parseToCurrency(data?.getPaymentInformation.checkout.subTotal)} />
          <Row title='Taxes' value={parseToCurrency(0)} />
          <Row title='Service Fee' value={parseToCurrency(data?.getPaymentInformation.serviceFee)} />
          <Row title='Tip' value={parseToCurrency(data?.getPaymentInformation.tip)} />
        </VStack>
        <Box>
          <PaymentElement id="payment-element" />
          {message && <Text color={"error.500"} fontSize={"lg"}>{message}</Text>}
        </Box>
      </ScrollView>
      <Center p={"6"}>
        <Button
          w={"75%"}
          onPress={handlePayment}
          isDisabled={!stripe || !elements || !paymentId || loading}
          isLoading={isProcessing}
          _text={{ bold: true }}
          fontSize={"lg"}
        >
          {
            `${t("payNow")} ${isNaN(Number(amount)) ?
              "" : parseToCurrency(Number(amount))}`}
        </Button>
      </Center>
      <PastOrdersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen} />
    </>
  )
}

const StripeWrapper: React.FC = ({ children }) => {
  const router = useRouter()
  const { clientSecret, businessId, checkoutId, country } = router.query

  useEffect(() => {
    if (!clientSecret) {
      router.back()
    }
  }, [businessId, checkoutId, clientSecret, router])

  if (typeof clientSecret !== "string" || typeof country !== "string") {
    return (
      <Text textAlign={"center"} fontSize={"lg"}>
        No Client Secret, nor Country
      </Text>)
  }

  return (
    <Elements
      stripe={stripePromise(country)}
      options={{ clientSecret }}>
      {children}
    </Elements>
  )
}

export const PaymentScreen = () => {
  return (
    <StripeWrapper>
      <CheckoutForm />
    </StripeWrapper>
  )
}
