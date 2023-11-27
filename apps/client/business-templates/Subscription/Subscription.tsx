import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Badge, Box, Button, Flex, HStack, Heading, ScrollView, Text, VStack, View } from 'native-base'
import React, { useCallback, useState } from 'react'
import { stripePromise } from '../../stripe/stripe'
import { GetSignUpSubscriptionsDocument, GetSignUpSubscriptionsQuery, useCancelSubscriptionMutation, useCreateSubscriptionMutation, useGetBusinessInformationQuery, useGetSignUpSubscriptionsQuery, useGetSubscriptionPricesQuery, useUpdateSubscriptionMutation } from '../../gen/generated'
import { parseToCurrency } from 'app-helpers'
import { OrangeBox } from '../../components/OrangeBox'
import { UpperSection } from '../../components/UpperSection'
import { showToast } from '../../components/showToast'
import { useRouter } from 'next/router'
import { DeleteAlert } from '../../components/DeleteAlert'
import { useTranslation } from 'next-i18next'
import { format } from 'date-fns'
import { getLocale } from '../../authUtilities/utils'

const Subscription = ({ signedUpSub }: { signedUpSub: GetSignUpSubscriptionsQuery["getSignUpSubscription"] }) => {
  const { t } = useTranslation("businessSubscriptions")
  const router = useRouter()

  const [cancelSubscription, { loading: cancelLoading }] = useCancelSubscriptionMutation({
    onError(error) {
      showToast({
        status: "error",
        message: t("errorCanceling"),
        subMessage: error.message
      })
    },
    onCompleted(data) {
      showToast({
        message: t("successCanceling")
      })
    },
    refetchQueries: [{ query: GetSignUpSubscriptionsDocument }]
  })

  if (!signedUpSub) return null

  return (

    <VStack
      p={8}
      space={2}
      borderWidth={1}
      borderRadius={"md"}
      borderColor={"primary.500"}
    >
      <HStack pb={2}>
        <Badge w={"24"} colorScheme="success">{signedUpSub.status.toUpperCase()}</Badge>
      </HStack>
      <Text fontSize={"lg"}>
        {"Tier: "}
        <Text bold>
          {signedUpSub.tier}
        </Text>
      </Text>
      <Text fontSize={"lg"}>
        {`${t("start")}: ${format((signedUpSub.current_period_start * 1000), "PPPP", getLocale(router.locale))}`}
      </Text>
      <Text fontSize={"lg"}>
        {`${t("finish")}: ${format((signedUpSub.current_period_end * 1000), "PPPP", getLocale(router.locale))}`}
      </Text>

      <Box w={"40"}>
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
          body={t("body")}
          title={t("cancel")}
          cancel={t("close")}
        />
      </Box>
    </VStack>
  )
}


const PriceSubscriptions = ({ selectedPrice, onPricePress, isLoading }:
  { isLoading: boolean; selectedPrice?: string, onPricePress: (price: string) => () => void }) => {
  const { t } = useTranslation("businessSubscriptions")
  const { data: businessInfo } = useGetBusinessInformationQuery()

  const { data, loading } = useGetSubscriptionPricesQuery({
    onError(error) {
      showToast({
        status: "error",
        message: t("errorGettingSubs"),
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
          <Text fontSize={"lg"}>{parseToCurrency(price.unit_amount,
            businessInfo?.getBusinessInformation.country) + `/${t("month")}`}</Text>
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
            {selectedPrice === price.id ? t("selected") : t("select")}
          </Button>
        </VStack>
      ))}
    </HStack>
  )

}

export const Subscriptions = () => {
  const { t } = useTranslation("businessSubscriptions")
  const { data: signedUpSubs, refetch } = useGetSignUpSubscriptionsQuery()
  const { data: businessInfo } = useGetBusinessInformationQuery()

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
        message: t("errorUpdating"),
        status: "error",
        subMessage: error.message
      })
    },
    onCompleted(data) {
      showToast({
        message: t("successUpdating")
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
          <Heading>{t("subscription")}</Heading>
          {signedUpSubs?.getSignUpSubscription ? (
            <>
              {/* Only show this when the update is pressed */}
              {/* We will show wich one is selected and let choose other plan */}
              <PriceSubscriptions
                isLoading={updateSubLoading}
                onPricePress={updateSubWithPrice}
                selectedPrice={signedUpSubs?.getSignUpSubscription.items.data[0].price.id}
              />
              <Subscription signedUpSub={signedUpSubs?.getSignUpSubscription} />
            </>
          ) : (
            <>
              <PriceSubscriptions
                isLoading={createLoading}
                onPricePress={createSubWithPrice}
                selectedPrice={createSubData?.createSubscription.price}
              />
              {createSubData?.createSubscription.clientSecret && businessInfo?.getBusinessInformation.country ?
                <Elements
                  stripe={stripePromise(businessInfo?.getBusinessInformation.country)}
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
  const { t } = useTranslation("businessSubscriptions")

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
        message: t("errorSubscribing"),
        subMessage: error.message
      })
    }

    if (paymentIntent?.status === "succeeded") {
      showToast({
        status: "success",
        message: t("successSubscribing"),
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
          {t("subscribe")}
        </Button>
      </View>
    </VStack>)
}