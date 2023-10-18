import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { Button, HStack, Heading, Text, VStack, View } from 'native-base'
import React from 'react'
import { stripePromise } from '../../stripe/stripe'
import { useCreateSubscriptionMutation, useGetSubscriptionPricesQuery } from '../../gen/generated'
import { parseToCurrency } from 'app-helpers'
import { OrangeBox } from '../../components/OrangeBox'
import { UpperSection } from '../../components/UpperSection'
import { showToast } from '../../components/showToast'

export const Subscriptions: React.FC = ({ children }) => {
  const { data } = useGetSubscriptionPricesQuery()
  const [createSub, { loading, data: createSubData }] = useCreateSubscriptionMutation({
    onError(error) {
      showToast({
        status: "error",
        message: "Error Subscribing",
        subMessage: error.message
      })
    },
  })

  // a function that will send the price id so the subscription can be made
  // a function that takes a parameter and return a function that uses the parameter
  const createSubWithPrice = (price: string) => () => createSub({
    variables: {
      input: { price }
    }
  })

  return (
    <View flex={1}>
      <OrangeBox />
      <VStack paddingX={6} paddingY={4} space={"6"}>
        <UpperSection >
          <Heading>
            Subscriptions
          </Heading>

          <HStack justifyContent={"space-around"} w={"100%"} space={4} p={4}>
            {data?.getSubscriptionPrices.map(sub => (
              <VStack
                space={3}
                key={sub.id}
                flex={1}
                borderColor={"coolGray.400"}
                borderWidth={1}
                borderRadius={"md"}
                alignItems={"center"}
                p={4}
              >
                <Heading size={"md"}>{sub.product.name}</Heading>
                <Text flex={1}>{sub.product.description}</Text>
                <Text>{parseToCurrency(sub.unit_amount)}</Text>

                <Button
                  borderColor={"primary.500"}
                  w={"100%"}
                  variant={"outline"}
                  onPress={createSubWithPrice(sub.id)}
                  isLoading={loading}
                >
                  Select
                </Button>
              </VStack>
            ))}
          </HStack>
        </UpperSection>

        {!createSubData ? null : <View>
          <Elements
            stripe={stripePromise("US")}
            options={{ clientSecret: createSubData?.createSubscription.clientSecret }}
          >
            <PaymentElement />
          </Elements>
        </View>}
      </VStack>
    </View>
  )
}
