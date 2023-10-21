import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button, HStack, Heading, ScrollView, Text, VStack, View } from 'native-base'
import React, { useCallback, useState } from 'react'
import { stripePromise } from '../../stripe/stripe'
import { GetSignUpSubscriptionsDocument, GetSignUpSubscriptionsQuery, useCancelSubscriptionMutation, useCreateSubscriptionMutation, useGetSignUpSubscriptionsQuery, useGetSubscriptionPricesQuery, useUpdateSubscriptionMutation } from '../../gen/generated'
import { parseToCurrency } from 'app-helpers'
import { OrangeBox } from '../../components/OrangeBox'
import { UpperSection } from '../../components/UpperSection'
import { showToast } from '../../components/showToast'
import { useRouter } from 'next/router'
import { DeleteAlert } from '../../components/DeleteAlert'
import { useTranslation } from 'react-i18next'

const Subscription = ({ signedUpSub }: { signedUpSub: GetSignUpSubscriptionsQuery["getSignUpSubscription"] }) => {
  const { t } = useTranslation("common")

  const [cancelSubscription, { loading: cancelLoading }] = useCancelSubscriptionMutation({
    onError(error) {
      showToast({
        status: "error",
        message: "Error Updating",
        subMessage: error.message
      })
    },
    onCompleted(data) {
      showToast({
        message: "Success Deleting"
      })
    },
    refetchQueries: [{ query: GetSignUpSubscriptionsDocument }]
  })

  if (!signedUpSub) return null

  return (
    <VStack>
      <View borderWidth={1} p={8} borderRadius={"md"}>
        <Text>{`${"Status: "}${signedUpSub.status}`}</Text>
        <Text>{`Start: ${new Date(signedUpSub.current_period_start * 1000).toString()}`}</Text>
        <Text>{`Finish: ${new Date(signedUpSub.current_period_end * 1000).toString()}`}</Text>
        <Button.Group>
          <DeleteAlert
            deleteItem={() => {
              cancelSubscription({
                variables: {
                  input: {
                    subscription: signedUpSub.id
                  }
                }
              })
            }}
            body={t("delete")}
            title={t("cancel")}
            cancel={t("close")}
          />
          <Button
            isLoading={cancelLoading}
            my={2} colorScheme={"tertiary"} onPress={() => console.log("update")}>
            Update
          </Button>
        </Button.Group>
      </View>

    </VStack>
  )
}


const PriceSubscriptions = ({ selectedPrice, onPricePress, isLoading }:
  { isLoading: boolean; selectedPrice?: string, onPricePress: (price: string) => () => void }) => {
  const { data, loading } = useGetSubscriptionPricesQuery({
    onError(error) {
      showToast({
        status: "error",
        message: "Error Getting Subscriptions",
        subMessage: error.message
      })
    },
  })

  return (
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
            isLoading={loading || isLoading}
            _text={{ bold: true }}
            borderColor={"primary.500"}
            w={"100%"}
            variant={"outline"}
            onPress={onPricePress(price.id)}
            isPressed={selectedPrice === price.id}
            isDisabled={selectedPrice === price.id || loading}
          >
            Select
          </Button>
        </VStack>
      ))}
    </HStack>
  )

}

export const Subscriptions = () => {
  const { t } = useTranslation("common")
  const { data: signedUpSubs, refetch } = useGetSignUpSubscriptionsQuery()

  const [createSub, { loading: createLoading, data: createSubData, reset }] = useCreateSubscriptionMutation({
    refetchQueries: [{ query: GetSignUpSubscriptionsDocument }],
    onError(error) {
      showToast({
        status: "error",
        message: "Error Subscribing",
        subMessage: error.message
      })
    },
  })

  const [updateSubscription, { loading: updateSubLoading, }] = useUpdateSubscriptionMutation({
    refetchQueries: [{ query: GetSignUpSubscriptionsDocument }],
    onError(error) {
      showToast({
        status: "error",
        message: "Error Updating",
        subMessage: error.message
      })
    },
    onCompleted(data) {
      showToast({
        message: "Success Updating"
      })
    },
  })

  const updateSubWithPrice = (price: string) => () => updateSubscription({
    variables: {
      input: {
        subscription: signedUpSubs?.getSignUpSubscription!.id!,
        price
      }
    }
  })

  const createSubWithPrice = (price: string) => () => createSub({
    variables: {
      input: { price }
    }
  })

  return (
    <ScrollView flex={1}>
      <OrangeBox />
      <VStack paddingX={6} paddingY={4} space={"6"}>
        <UpperSection>
          <Heading>Subscriptions</Heading>
          {signedUpSubs?.getSignUpSubscription ? (
            <>
              <Subscription signedUpSub={signedUpSubs?.getSignUpSubscription} />
              {/* Only show this when the update is pressed */}
              {/* We will show wich one is selected and let choose other plan */}
              <PriceSubscriptions
                isLoading={updateSubLoading}
                onPricePress={updateSubWithPrice}
                selectedPrice={signedUpSubs?.getSignUpSubscription.items.data[0].price.id}
              />
            </>
          ) : (
            <>
              <PriceSubscriptions
                isLoading={createLoading}
                onPricePress={createSubWithPrice}
                selectedPrice={createSubData?.createSubscription.price}
              />
              {createSubData?.createSubscription.clientSecret ?
                <Elements
                  stripe={stripePromise("US")}
                  options={{ clientSecret: createSubData?.createSubscription.clientSecret }}
                >
                  <PaymentForm refetch={() => {
                    refetch()
                    reset()
                  }} />
                </Elements> : null}
            </>
          )}
        </UpperSection>
      </VStack>
    </ScrollView>
  )
}

const PaymentForm = ({ refetch }: { refetch: () => void }) => {
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

      refetch()
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