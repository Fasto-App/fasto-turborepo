import { Box, Button, Divider, HStack, Text, Input, Pressable, VStack, Link } from 'native-base'
import { useTranslation } from "next-i18next"
import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { TakeoutDeliveryDineIn, useCustomerRequestPayFullMutation, useGeneratePaymentIntentMutation, useGetCheckoutByIdQuery } from '../../gen/generated'
import { showToast } from '../../components/showToast'
import { PastOrdersList } from '../CartScreen/PastOrdersModal'
import { percentageSelectData, useCheckoutStore, useComputedChekoutStore } from '../../business-templates/Checkout/checkoutStore'
import { parseToCurrency } from 'app-helpers'
import { FDSSelect } from '../../components/FDSSelect'
import { shallow } from 'zustand/shallow'
import { Icon } from '../../components/atoms/NavigationButton'
import { customerRoute } from 'fasto-route'
import { useGetBusinessInformation, useGetClientSession } from '../../hooks'
import { ModalAddress } from '../../components/ModalAddress'

export const CheckoutScreen = () => {
  const { data: businessData, loading: businessLoading } = useGetBusinessInformation()

  const router = useRouter()
  const { checkoutId, businessId } = router.query

  const [generatePaymentIntent, { loading: isPaymentIntLoading }] = useGeneratePaymentIntentMutation({
    onCompleted: ({ generatePaymentIntent: { clientSecret, paymentIntent, amount, } }, clientOptions) => {
      if (!clientOptions?.variables?.input.payment) throw new Error("Missing paymentId")

      router.push({
        pathname: customerRoute['/customer/[businessId]/payment'],
        query: {
          businessId,
          clientSecret,
          paymentIntent,
          checkoutId: checkoutId as string,
          paymentId: clientOptions?.variables?.input.payment,
          amount,
          country: businessData?.getBusinessById.address?.country
        }
      })

    },
    onError: (error) => {
      showToast({
        message: `Error generating payment intent: ${error.cause}`,
        status: "error"
      })
    }
  })

  const { t } = useTranslation('customerCheckout')

  const { data: clientData } = useGetClientSession()

  const { data } = useGetCheckoutByIdQuery({
    skip: !checkoutId,
    variables: {
      input: {
        _id: checkoutId as string
      }
    },
  })

  const [requestPayFull, { loading }] = useCustomerRequestPayFullMutation({
    onError: (error) => {
      showToast({
        status: "error",
        message: t("errorRequestingfullCheckout"),
      })
    }
  })


  const { tip } = useCheckoutStore(state => ({
    tip: state.tip,
  }), shallow)

  const splitType = data?.getCheckoutByID?.splitType
  const payment = splitType && data?.getCheckoutByID?.payments.find(payment => payment?.patron === clientData?.getClientSession.user._id)

  const pay = () => {
    if (!checkoutId || !clientData?.getClientSession.tab?.checkout) throw new Error("Missing checkoutId")

    requestPayFull({
      variables: {
        input: {
          tip,
          checkout: clientData?.getClientSession.tab?.checkout,
          patron: clientData?.getClientSession.user._id,
        }
      }
    })
  }

  const navigateToSplit = useCallback(() => {
    if (!checkoutId || !businessId) throw new Error("Missing checkoutId or businessId")

    router.push({
      pathname: customerRoute['/customer/[businessId]/split/[checkoutId]'],
      query: {
        businessId,
        checkoutId
      }
    })
  }, [businessId, checkoutId, router])

  const endSession = useCallback(() => {
    if (!payment?._id) throw new Error("Missing paymentId")

    generatePaymentIntent({
      variables: {
        input: {
          payment: payment?._id,
        }
      }
    })

  }, [generatePaymentIntent, payment])

  // if the tab is Delivery, should show the User Address, and if it's takeout should show business addess
  const [updateAddressModalOpen, setUpdateAddressModalOpen] = useState(false)

  const userAddress = useMemo(() => {
    if (clientData?.getClientSession.tab?.type !== TakeoutDeliveryDineIn.Delivery ||
      !clientData?.getClientSession.user?.address) return undefined

    const { stateOrProvince, city, streetAddress, complement } = clientData?.getClientSession.user?.address

    return `${streetAddress}, ${complement} - ${city}, ${stateOrProvince}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientData?.getClientSession.user?.address?._id])

  return (
    <Box flex={1}>
      <PastOrdersList />
      {userAddress ?
        <>
          <Divider marginY={2} />
          <VStack paddingX={"4"} paddingY={"2"} space={"2"} >
            <Text pb={"2"} bold fontSize={"lg"}>Delivery Info</Text>
            <Text fontSize={"lg"}>{clientData?.getClientSession.user.name}</Text>
            <Text fontSize={"lg"}>{userAddress}</Text>
            <Pressable
              isDisabled={!!splitType}
              _disabled={{ opacity: 0.6 }}
              onPress={() => setUpdateAddressModalOpen(true)}>
              <Text fontSize={"lg"} color={"blue.500"}>
                Edit Address
              </Text>
            </Pressable>
          </VStack>
        </>
        : null}
      {!splitType ?
        <Box>
          <OrderTotals />
          <HStack space={"4"} p={4}>
            <Button
              _text={{ bold: true }}
              flex={1}
              colorScheme={"primary"}
              isDisabled={!(clientData?.getClientSession.tab?.admin === clientData?.getClientSession.user._id)
                || !checkoutId || !clientData?.getClientSession.tab?.checkout}
              isLoading={loading}
              onPress={pay}>
              {t("finalize")}
            </Button>
            {(clientData?.getClientSession.tab?.users?.length || 0) > 1 ? (
              <Button
                _text={{ bold: true }}
                flex={1}
                colorScheme={"tertiary"}
                onPress={navigateToSplit}>{t("split")}</Button>
            ) : null}
          </HStack>
        </Box> : <Box>
          <VStack p={4} space={2}>
            <HStack justifyContent={"space-between"}>
              <Text fontSize="lg" fontWeight="bold">{t("splitType")}</Text>
              <Text fontSize="lg" fontWeight="bold">{t(splitType)}</Text>
            </HStack>
            <Divider />
            <HStack justifyContent={"space-between"}>
              <Text fontSize="lg" fontWeight="bold">{t("totalAmount")}</Text>
              <Text fontSize="lg" fontWeight="bold">{parseToCurrency(data?.getCheckoutByID.total)}</Text>
            </HStack>
            <Divider />
            <HStack justifyContent={"space-between"}>
              <Text fontSize="lg" fontWeight="bold">{t("amountToBePaid")}</Text>
              <Text fontSize="lg" fontWeight="bold">{parseToCurrency(payment?.amount)}</Text>
            </HStack>
            <Divider />
          </VStack>
          <HStack space={"4"} p={4}>
            <Button
              flex={1}
              onPress={endSession}
              isLoading={isPaymentIntLoading || businessLoading}
              _text={{ bold: true }}
            >
              {t("payNow")}
            </Button>
          </HStack>
        </Box>}
      {clientData?.getClientSession.tab?._id ? (
        <ModalAddress
          isOpen={updateAddressModalOpen}
          tabId={clientData?.getClientSession.tab._id}
          setIsOpen={setUpdateAddressModalOpen}
          selectedType={clientData?.getClientSession.tab.type}
          address={clientData?.getClientSession.user.address}

        />) : null}
    </Box>
  )
}

export const OrderTotals = () => {
  const [show, setShow] = useState(true)

  const router = useRouter()
  const { checkoutId } = router.query

  const { t } = useTranslation('customerCheckout')
  const { absoluteTotal, tipCalculation } = useComputedChekoutStore()

  const { setSelectedTip, selectedTip, total, setCustomTip, customTip, setTotal, setServiceFeeValue } = useCheckoutStore(state => ({
    setSelectedTip: state.setSelectedTip,
    selectedTip: state.selectedTip,
    total: state.total,
    setCustomTip: state.setCustomTip,
    customTip: state.customTip,
    setTotal: state.setTotal,
    setServiceFeeValue: state.setServiceFeeValue
  }),
    shallow
  )

  const { loading, data } = useGetCheckoutByIdQuery({
    skip: !checkoutId,
    pollInterval: 1000 * 60,
    variables: {
      input: {
        _id: checkoutId as string
      }
    },
    onError: () => {
      showToast({
        message: t("errorFetchingCheckoutInfo"),
        status: "error",
      })
    },
    onCompleted: (data) => {
      // on success set the total on the zustand store
      if (data.getCheckoutByID.subTotal) {
        setTotal(data.getCheckoutByID.subTotal)
        setServiceFeeValue(data.getCheckoutByID.serviceFeeValue)
      }
    },
  })

  const serviceFeeValue = data?.getCheckoutByID.serviceFeeValue || 0

  return (
    <Box>
      <Divider marginY={2} />
      <Pressable onPress={() => setShow(!show)}>
        <HStack flex={1} justifyContent={"flex-end"} px="2">
          <Icon type={show ? 'ArrowDown' : 'ArrowUp'} size={"1.5em"} />
        </HStack>
      </Pressable>
      {show ?
        <>
          <HStack justifyContent={"space-between"} pt={4} px={4}>
            <Text fontSize={"lg"}>{t("subtotal")}</Text>
            <Text fontSize={"lg"}>{parseToCurrency(total)}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} pt={4} px={4}>
            <Text fontSize={"lg"}>{t("taxes")}</Text>
            <Text fontSize={"lg"}>{parseToCurrency(0)}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} pt={4} px={4}>
            <Text fontSize={"lg"}>{t("serviceFee")}</Text>
            <Text fontSize={"lg"}>{parseToCurrency(serviceFeeValue)}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} pt={4} px={4}>
            <Text fontSize={"lg"}>{t("tip")}</Text>
            <HStack space={2}>
              <FDSSelect
                h={10} w={120}
                array={percentageSelectData}
                selectedValue={selectedTip}
                // @ts-ignore
                setSelectedValue={setSelectedTip}
              />
              {selectedTip === "Custom" ?
                <Input
                  w={100} h={10}
                  fontSize={"lg"}
                  textAlign={"right"}
                  value={(Number(customTip.toString()) / 100)
                    .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  onChangeText={(value) => {
                    const text = value.replace(/[$,.]/g, '');
                    const convertedValue = Number(text);

                    if (isNaN(convertedValue)) return

                    return setCustomTip(convertedValue)
                  }}
                /> :
                <Text
                  textAlign={"right"}
                  alignSelf={"center"}
                  w={100} fontSize={"lg"}>
                  {parseToCurrency(tipCalculation)}
                </Text>}
            </HStack>
          </HStack>
        </> : null}

      <HStack justifyContent={"space-between"} pt={2} px={4}>
        <Text fontSize={"xl"} bold>{t('totalAmount')}</Text>
        <Text fontSize={"xl"} bold>{parseToCurrency(absoluteTotal + serviceFeeValue)}</Text>
      </HStack>
    </Box>
  )
}
