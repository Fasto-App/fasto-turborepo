import React, { useCallback, useMemo, useState } from 'react'
import { SuccessAnimation } from '../../components/SuccessAnimation'
import { Box, Button, Center, Divider, HStack, Image, Pressable, Text, VStack } from 'native-base'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { customerRoute } from 'fasto-route'
import { clearClientCookies } from '../../cookies'
import { PastOrdersModal } from '../CartScreen/PastOrdersModal'
import { TakeoutDeliveryDineIn, useGetCheckoutByIdQuery } from '../../gen/generated'
import { useGetClientSession } from '../../hooks'
import { parseToCurrency } from 'app-helpers'

export const SuccessScreen = () => {

  const { t } = useTranslation(["customerCheckout", "common"])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  const { businessId } = router.query

  const { data: clientData } = useGetClientSession()

  const { data } = useGetCheckoutByIdQuery({
    skip: !clientData?.getClientSession.tab?.checkout,
    variables: {
      input: {
        _id: clientData?.getClientSession.tab?.checkout!
      }
    },
  })

  const userAddress = useMemo(() => {
    if (clientData?.getClientSession.tab?.type !== TakeoutDeliveryDineIn.Delivery ||
      !clientData?.getClientSession.user?.address) return undefined

    const { stateOrProvince, city, streetAddress, complement } = clientData?.getClientSession.user?.address

    return `${streetAddress}, ${complement} - ${city}, ${stateOrProvince}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientData?.getClientSession.user?.address?._id])

  const endSession = useCallback(() => {
    if (!businessId) throw new Error("Missing businessId")

    clearClientCookies(typeof businessId === "string" ? businessId : businessId[0])

    router.push({
      pathname: customerRoute['/customer/[businessId]'],
      query: {
        businessId
      }
    })

  }, [businessId, router])

  const payment = data?.getCheckoutByID?.payments.find(payment => payment?.patron === clientData?.getClientSession.user._id)

  return (
    <>
      <PastOrdersModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
      <Box flex={1} height={"100%"}>
        <Center p={"4"} flex={1}>
          <Box pb={12}>
            <Image src="/images/fasto-logo.svg"
              alt="Fasto Logo"
              height={36} width={180} />
          </Box>
          <Box size={"24"}>
            <SuccessAnimation />
          </Box>
          {/* t("successMessage") */}
          <Text textAlign={"center"} fontSize={"lg"} mt={8}>{"Sua conta foi encerrada com sucesso.\nObrigado por pedir com a gente!"}</Text>
        </Center>
        {userAddress ?
          <>
            <Divider marginY={2} />
            <VStack paddingX={"4"} paddingY={"2"} space={"2"} >
              <Text pb={"2"} bold fontSize={"lg"}>Delivery Info</Text>
              <Text fontSize={"lg"}>{clientData?.getClientSession.user.name}</Text>
              <Text fontSize={"lg"}>{userAddress}</Text>
            </VStack>
            <Divider marginY={2} />
          </>
          : null}
        {data ? <VStack p={4} space={2}>
          {data?.getCheckoutByID?.splitType ? <HStack justifyContent={"space-between"}>
            <Text fontSize="lg" fontWeight="bold">{t("customerCheckout:splitType")}</Text>
            <Text fontSize="lg" fontWeight="bold">{t(`customerCheckout:${data?.getCheckoutByID?.splitType}`)}</Text>
          </HStack> : null}
          <Divider />
          <HStack justifyContent={"space-between"}>
            <Text fontSize="lg" fontWeight="bold">{t("customerCheckout:totalAmount")}</Text>
            <Text fontSize="lg" fontWeight="bold">{parseToCurrency(data?.getCheckoutByID.total)}</Text>
          </HStack>
          <Divider />
          <HStack justifyContent={"space-between"}>
            <Text fontSize="lg" fontWeight="bold">{t("customerCheckout:amountToBePaid")}</Text>
            <Text fontSize="lg" fontWeight="bold">{parseToCurrency(payment?.amount)}</Text>
          </HStack>
          <Divider />
        </VStack> : null}
        <HStack space={"4"} p={4}>
          <Button
            flex={1}
            onPress={endSession}
            _text={{ bold: true }}
          >
            {t("common:logout")}
          </Button>
          <Button
            _text={{ bold: true }}
            flex={1}
            colorScheme={"tertiary"}
            onPress={() => setIsModalOpen(true)}>
            {t("common:allOrders")}
          </Button>
        </HStack>
      </Box>
    </>
  )
}
