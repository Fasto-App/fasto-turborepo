import React, { useCallback, useState } from "react"
import { Avatar, Box, Button, Center, HStack, Heading, Link, Skeleton, Text, VStack } from "native-base"
import { BusinessType, GetIsConnectdQuery, IsoCountry, useConnectExpressPaymentMutation, useCreateStripeAccessLinkLazyQuery, useGenerateStripePayoutMutation, useGetBusinessInformationQuery, useGetIsConnectdQuery } from "../../gen/generated"
import { showToast } from "../../components/showToast"
import { ControlledForm, RegularInputConfig } from "../../components/ControlledForm"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { OrangeBox } from "../../components/OrangeBox"
import { z } from "zod"
import { parseToCurrency, typedKeys } from "app-helpers"
import { useTranslation } from "next-i18next"
import { BottomCheckoutTableWithModal } from "./BottomCheckoutTableWithModal"
import { UpperSection } from "../../components/UpperSection"

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
}

export const connectPaymentSchema = z.object({
  accounttype: z.nativeEnum(BusinessType)
})

type ConnectPaymentSchema = z.infer<typeof connectPaymentSchema>

const ConnectPaymentForm = () => {
  const { control, formState, handleSubmit } = usePaymentFormHook()
  const { t } = useTranslation("businessPayments")

  const [connectExpressPayment, { loading }] = useConnectExpressPaymentMutation({
    onCompleted: (data) => {
      window.location.assign(data.connectExpressPayment)
    },
    onError: () => {
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
  const [modalData, setModalData] = useState({ isOpen: false, checkoutId: "" })

  const { data, loading, error } = useGetIsConnectdQuery()

  return (
    <Box flex={1}>
      <OrangeBox />
      {error ? <Text>Error</Text> :
        typeof data === "undefined" || loading ?
          <Center
            flex={1}
            py={6}
            px={8}
            justifyContent={"space-between"} >
            <LoadingPDP />
          </Center>
          :
          data.getIsConnected ?
            <VStack flex={1} p={4} space={4}>
              <Payouts
                balanceAvailable={data.getIsConnected.balanceAvailable}
                balanceCurrency={data.getIsConnected.balanceCurrency}
                balancePending={data.getIsConnected.balancePending}
                name={data.getIsConnected.name}
                url={data.getIsConnected.url}
              />
              <BottomCheckoutTableWithModal
                setModalData={setModalData}
                modalData={modalData}
              />
            </VStack>
            :
            <Center
              flex={1}
              py={6}
              px={8}
              justifyContent={"space-between"} >
              <ConnectPaymentForm />
            </Center>
      }
    </Box>
  )
}

const Payouts = (
  { balanceAvailable, balanceCurrency, balancePending, name, url }:
    NonNullable<GetIsConnectdQuery["getIsConnected"]>) => {

  const { t } = useTranslation("businessPayments")

  const { data } = useGetBusinessInformationQuery()

  const [createStripeLink, { loading }] = useCreateStripeAccessLinkLazyQuery({
    onCompleted: (data) => {
      if (!data.createStripeAccessLink) return
      window.open(data.createStripeAccessLink)
    }
  })

  const [generatePayout, { loading: loadingPayout }] = useGenerateStripePayoutMutation({
    refetchQueries: ["getIsConnectd"]
  })

  const onLinkPress = useCallback(() => {
    createStripeLink()
  }, [createStripeLink])

  return (
    <HStack
      backgroundColor={"white"}
      borderColor={"gray.300"}
      w={"100%"}
      borderWidth={1}
      justifyContent={"space-between"}
      paddingX={"10"}
      paddingY={"4"}
      borderRadius={"md"}
    >
      <HStack space={4}>
        <Avatar backgroundColor={"white"}
          size={"xl"}
          borderWidth={2}
          source={{ uri: data?.getBusinessInformation.picture || "" }}
          borderColor={"primary.500"}>
          <Avatar.Badge bg="green.500" />
        </Avatar>

        <Box justifyContent={"space-evenly"}>
          <Heading >{name}</Heading>
          <Link
            onPress={onLinkPress} isExternal _text={{
              color: "blue.500",
              fontSize: "lg"
            }}>
            {t("viewPayoutsOnStripe")}
          </Link>
        </Box>
      </HStack>
      <VStack justifyContent={"space-between"}>
        <Text fontSize={"lg"}>{t("yourBalance")}</Text>
        <Text fontSize="xl">
          {parseToCurrency(balancePending)}
        </Text>
        <Text color={"gray.500"} fontSize={"lg"}>
          {`${parseToCurrency(balanceAvailable)} ${t("available")}`}
        </Text>
      </VStack>
      <VStack justifyContent={"center"} alignItems={"center"}>
        <Button
          isDisabled={balanceAvailable <= 0}
          onPress={() => generatePayout()}
          isLoading={loading || loadingPayout}
          _text={{ bold: true }} colorScheme={"tertiary"} size={"lg"} w={"64"}>
          {t("payoutNow")}
        </Button>
      </VStack>
    </HStack>
  )
}

export const LoadingPDP = () => {
  return (
    <HStack
      backgroundColor={"white"}
      borderColor={"gray.300"}
      w={"100%"}
      borderWidth={1}
      justifyContent={"space-between"}
      paddingX={"10"}
      paddingY={"4"}
      borderRadius={"md"}
      space={8}
    >

      <HStack space={4} flex={2}>
        <Skeleton borderWidth={1} borderColor="coolGray.200" endColor="warmGray.50" size="20" rounded="full" />
        <VStack space={4} flex={1}>
          <Skeleton h="4" rounded="md" />
          <Skeleton h="8" rounded="md" />
          <Skeleton h="4" rounded="md" />
        </VStack>
      </HStack>
      <VStack space={4} flex={1}>
        <Skeleton h="4" rounded="md" />
        <Skeleton h="8" rounded="md" />
        <Skeleton h="4" rounded="md" />
      </VStack>
      <VStack space={4} flex={1}>
        <Skeleton h="4" rounded="md" />
        <Skeleton h="8" rounded="md" />
        <Skeleton h="4" rounded="md" />
      </VStack>
      <VStack flex={1}>
        <Skeleton mb="3" w="100%" h="16" rounded="sm" />
        <Skeleton h="4" rounded="md" />
      </VStack>
    </HStack>
  )
}