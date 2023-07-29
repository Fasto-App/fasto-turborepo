import React from "react"
import { Avatar, Box, Button, Center, HStack, Heading, Link, Text, VStack } from "native-base"
import { BusinessType, GetIsConnectdQuery, IsoCountry, useConnectExpressPaymentMutation, useGetIsConnectdQuery } from "../../gen/generated"
import { showToast } from "../../components/showToast"
import { ControlledForm, RegularInputConfig } from "../../components/ControlledForm"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { OrangeBox } from "../../components/OrangeBox"
import { z } from "zod"
import { parseToCurrency, typedKeys } from "app-helpers"
import { LoadingPDP } from "../../customer-templates/ProductDescriptionScreen/LoadingPDP"
import { useTranslation } from "next-i18next"

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
  const { t } = useTranslation("businessPayments")

  const [connectExpressPayment, { loading }] = useConnectExpressPaymentMutation({
    onCompleted: (data) => {
      console.log(data)
      window.location.assign(data.connectExpressPayment)
    },
    onError: (error) => {

      showToast({
        status: "error",
        message: t("errorConnectingToStripe")
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

    <Heading textAlign={"center"}>{t("setupYourPayments")}</Heading>
    <ControlledForm Config={PaymentConfig} control={control} formState={formState} />
    <Box borderRadius={"lg"}>
      <Text fontSize={"lg"} textAlign={"justify"} pb={2}>
        {t("useUseStripeConnect")}
      </Text>
    </Box>

    <Button w={"100%"} _text={{ bold: true }} size={"lg"} colorScheme={"tertiary"}
      onPress={handleSubmit(onSubmit)}
      isLoading={loading}
    >
      {t("saveAndContinue")}
    </Button>
  </VStack>
  )
}

export const PaymentsScreen = () => {
  const isConnected = false;

  const { data, loading, error } = useGetIsConnectdQuery()

  return (
    <Box flex={1}>
      <OrangeBox />
      <Center flex={1} py={6} px={8} justifyContent={"space-between"} >
        {error ? <Text>Error</Text> :
          typeof data === "undefined" || loading ? <LoadingPDP /> :
            data.getIsConnected ?
              <Payouts
                balanceAvailable={data.getIsConnected.balanceAvailable}
                balanceCurrency={data.getIsConnected.balanceCurrency}
                balancePending={data.getIsConnected.balancePending}
                name={data.getIsConnected.name}
                url={data.getIsConnected.url}
              /> :
              <ConnectPaymentForm />
        }
      </Center>
    </Box>
  )
}

const Payouts = (
  { balanceAvailable, balanceCurrency, balancePending, name, url }:
    NonNullable<GetIsConnectdQuery["getIsConnected"]>) => {

  const onPress = () => {
    console.log("pressed")
    window.location.assign("https://google.com")
  }

  return (
    <HStack
      backgroundColor={"white"}
      borderColor={"gray.300"}
      w={"100%"}
      borderWidth={1}
      justifyContent={"space-between"}
      paddingX={"10"}
      paddingY={"4"} borderRadius={"md"}
      minW={"864"}
    >
      <HStack space={4}>
        <Avatar size={"xl"}>
          <Avatar.Badge bg="green.500" />
        </Avatar>

        <Box justifyContent={"space-evenly"}>
          <Heading >{name}</Heading>
          <Link
            onPress={onPress} _text={{
              color: "blue.500",
              fontSize: "lg"
            }}>
            View Stripe Account
          </Link>
        </Box>
      </HStack>

      <VStack justifyContent={"space-between"}>
        <Text fontSize={"lg"}>This Week</Text>
        <Text fontSize="xl">
          $0.00
        </Text>
        <Text color={"gray.500"} fontSize={"lg"}>
          0 orders
        </Text>
      </VStack>

      <VStack justifyContent={"space-between"}>
        <Text fontSize={"lg"}>Your Balance</Text>
        <Text fontSize="xl">
          {parseToCurrency(balancePending)}
        </Text>

        <Text color={"gray.500"} fontSize={"lg"}>
          {`${parseToCurrency(balanceAvailable)} available`}
        </Text>

      </VStack>

      <VStack justifyContent={"space-between"} alignItems={"center"}>
        <Button _text={{ bold: true }} colorScheme={"tertiary"} size={"lg"} w={"64"}>
          Payout Now
        </Button>

        <Link
          onPress={onPress} isExternal _text={{
            color: "blue.500",
            fontSize: "lg"
          }}>
          View Payouts on Stripe
        </Link>
      </VStack>
    </HStack>
  )
}

const Loading = () => {

}