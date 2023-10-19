import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button, HStack, Heading, ScrollView, Text, VStack, View } from 'native-base'
import React, { useState } from 'react'
import { stripePromise } from '../../stripe/stripe'
import { useCreateSubscriptionMutation, useGetSignUpSubscriptionsQuery, useGetSubscriptionPricesQuery } from '../../gen/generated'
import { parseToCurrency } from 'app-helpers'
import { OrangeBox } from '../../components/OrangeBox'
import { UpperSection } from '../../components/UpperSection'
import { showToast } from '../../components/showToast'
import { useRouter } from 'next/router'

export const Subscriptions = () => {

  const { data: signedUpSubs } = useGetSignUpSubscriptionsQuery()

  const { data, loading: getPricesLoading } = useGetSubscriptionPricesQuery({
    onError(error) {
      showToast({
        status: "error",
        message: "Error Getting Subscriptions",
        subMessage: error.message
      })
    },
  })

  const [createSub, { loading, data: createSubData }] = useCreateSubscriptionMutation({
    onError(error) {
      showToast({
        status: "error",
        message: "Error Subscribing",
        subMessage: error.message
      })
    },
  })
  const selectedPrice = createSubData?.createSubscription.price

  const createSubWithPrice = (price: string) => () => createSub({
    variables: {
      input: { price }
    }
  })

  console.log(signedUpSubs?.getSignUpSubscriptions)

  return (
    <ScrollView flex={1}>
      <OrangeBox />


      <VStack paddingX={6} paddingY={4} space={"6"}>
        <UpperSection >
          <Heading>
            Subscriptions
          </Heading>

          <HStack justifyContent={"space-around"} w={"100%"} space={4} p={4}>
            {data?.getSubscriptionPrices.map(price => (
              <VStack
                space={3}
                key={price.id}
                flex={1}
                borderColor={selectedPrice === price.id ? "primary.500" : "coolGray.400"}
                borderWidth={selectedPrice === price.id ? 2 : 1}
                backgroundColor={selectedPrice === price.id ? "primary.50" : "white"}
                borderRadius={"md"}
                alignItems={"center"}
                p={4}
              >
                <Heading size={"md"}>{price.product.name}</Heading>
                <Text flex={1}>{price.product.description}</Text>
                <Text fontSize={"lg"}>{parseToCurrency(price.unit_amount) + "/Month"}</Text>

                <Button
                  _text={{ bold: true }}
                  borderColor={"primary.500"}
                  w={"100%"}
                  variant={"outline"}
                  onPress={createSubWithPrice(price.id)}
                  isLoading={loading}
                  isPressed={selectedPrice === price.id}
                  isDisabled={selectedPrice === price.id || loading || getPricesLoading}
                >
                  Select
                </Button>
              </VStack>
            ))}
          </HStack>
        </UpperSection>



        {createSubData?.createSubscription.clientSecret ?
          <Elements
            stripe={stripePromise("US")}
            options={{ clientSecret: createSubData?.createSubscription.clientSecret }}
          >
            <PaymentForm />
          </Elements> : null}

        <VStack borderWidth={1}>
          {signedUpSubs?.getSignUpSubscriptions?.map(subs => (
            <View key={subs?.id} borderWidth={1} p={8}>
              <Text>{subs?.id}</Text>
              <Text>{subs?.status}</Text>
            </View>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  )
}

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter()

  const handlePayment = async () => {
    const RETURN_URL = `${window.location.origin}${router.pathname}`

    if (!stripe || !elements) {
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

    setIsProcessing(false);

    if (error) {
      showToast({
        status: "error",
        message: "Error Subscribing",
        subMessage: error.message
      })
    }

    if (paymentIntent?.status === "succeeded") {
      showToast({
        status: "success",
        message: "Success subscribing",
      })
    }
  }

  return (
    <VStack space={8} flex={1} alignContent={"center"}>
      <PaymentElement />
      <View alignItems={"center"}>
        <Button
          onPress={handlePayment}
          w={"100%"}
          maxW={600}
          _text={{ bold: true }}
          isLoading={isProcessing}>
          Subscribe
        </Button>
      </View>
    </VStack>)
}