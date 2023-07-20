import React from "react"
import { Avatar, Box, Button, Center, HStack, Heading, Link, Text, VStack } from "native-base"
import { BusinessType, IsoCountry, useConnectExpressPaymentMutation } from "../../gen/generated"
import { showToast } from "../../components/showToast"
import { ControlledForm, RegularInputConfig } from "../../components/ControlledForm"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { OrangeBox } from "../../components/OrangeBox"
import { z } from "zod"
import { typedKeys } from "app-helpers"

const usePaymentFormHook = () => {
  return useForm({
    resolver: zodResolver(connectPaymentSchema),
    defaultValues: {
      accounttype: "individual" as BusinessType,
      country: "US" as IsoCountry,
    },
  })
}

const PaymentConfig: RegularInputConfig = {
  accounttype: {
    name: "accounttype",
    label: "Account Type",
    inputType: "Radio",
    array: typedKeys(BusinessType).map((key) => ({ name: key, _id: BusinessType[key] })),
    defaultValue: "individual",
  },
  country: {
    name: "country",
    label: "Country",
    inputType: "Select",
    array: typedKeys(IsoCountry).map((key) => ({ name: IsoCountry[key], _id: IsoCountry[key] })),
    defaultValue: "US",
  },
}

export const connectPaymentSchema = z.object({
  accounttype: z.nativeEnum(BusinessType),
  country: z.nativeEnum(IsoCountry),
})

type ConnectPaymentSchema = z.infer<typeof connectPaymentSchema>

const ConnectPaymentForm = () => {
  const { control, formState, handleSubmit } = usePaymentFormHook()

  const [connectExpressPayment, { loading }] = useConnectExpressPaymentMutation({
    onCompleted: (data) => {
      console.log(data)
      window.location.assign(data.connectExpressPayment)
    },
    onError: (error) => {

      showToast({
        status: "error",
        message: "Error connecting to Stripe. Please try again later."
      })
    }
  })

  const onSubmit = (data: ConnectPaymentSchema) => {
    connectExpressPayment({
      variables: {
        input: {
          business_type: data.accounttype,
          country: data.country,
        }
      }
    })
  }

  return (< VStack
    backgroundColor={"white"}
    flex={1} space={4} borderWidth={1} maxW={700} p={8} borderColor={"gray.300"}
    borderRadius={"md"}
  >

    <Heading textAlign={"center"}>Set up your Payments</Heading>
    <ControlledForm Config={PaymentConfig} control={control} formState={formState} />
    <Box borderRadius={"lg"}>
      <Text fontSize={"lg"} textAlign={"justify"} pb={2}>
        We use Stripe to make sure you get paid on time and to keep your personal bank and details secure. Click Save and continue to set up your payments on Stripe.
      </Text>
    </Box>

    <Button w={"100%"} _text={{ bold: true }} size={"lg"} colorScheme={"tertiary"}
      onPress={handleSubmit(onSubmit)}
      isLoading={loading}
    >
      Save and Continue
    </Button>
  </VStack>
  )
}

export const PaymentsScreen = () => {
  const isConnected = false;

  return (
    <Box flex={1}>
      <OrangeBox />
      <Center flex={1} py={6} px={8} justifyContent={"space-between"} >
        {isConnected ? <Payouts /> :
          <ConnectPaymentForm />
        }
      </Center>
    </Box>
  )
}

const Payouts = () => {
  return (
    <HStack
      backgroundColor={"white"}
      borderColor={"gray.300"}
      w={"100%"}
      borderWidth={1}
      justifyContent={"space-between"}
      paddingX={"10"}
      paddingY={"4"} borderRadius={"md"}>
      <HStack space={4}>
        <Avatar size={"xl"}>
          <Avatar.Badge bg="green.500" />
        </Avatar>

        <Box justifyContent={"space-evenly"}>
          <Text fontSize={"lg"}>Business since Jul 2023</Text>
          <Heading >Business Name</Heading>
          <Link
            href="https://nativebase.io" isExternal _text={{
              color: "blue.500",
              fontSize: "lg"
            }}>
            View Payouts on Stripe
          </Link>
        </Box>
      </HStack>

      <VStack justifyContent={"space-between"}>
        <Text fontSize={"lg"}>This Week</Text>
        <Text fontSize="xl">
          $500.00
        </Text>
        <Text color={"gray.500"} fontSize={"lg"}>
          4 orders
        </Text>
      </VStack>

      <VStack justifyContent={"space-between"}>
        <Text fontSize={"lg"}>Your Balance</Text>
        <Text fontSize="xl">
          $500.00
        </Text>

        <Text color={"gray.500"} fontSize={"lg"}>
          $93.16 available
        </Text>

      </VStack>

      <VStack justifyContent={"space-between"} alignItems={"center"}>
        <Button _text={{ bold: true }} colorScheme={"tertiary"} size={"lg"} w={"64"}>
          Payout Now
        </Button>

        <Link
          href="https://nativebase.io" isExternal _text={{
            color: "blue.500",
            fontSize: "lg"
          }}>
          View Payouts on Stripe
        </Link>
      </VStack>
    </HStack>
  )
}