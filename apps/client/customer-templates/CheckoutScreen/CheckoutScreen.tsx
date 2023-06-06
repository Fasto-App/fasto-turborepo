import { Box, Button, Divider, HStack, Text, Input, Pressable, VStack, Image, Center } from 'native-base'
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useCustomerRequestPayFullMutation, useGetCheckoutByIdQuery } from '../../gen/generated'
import { showToast } from '../../components/showToast'
import { PastOrdersList, PastOrdersModal } from '../CartScreen/PastOrdersModal'
import { percentageSelectData, useCheckoutStore, useComputedChekoutStore } from '../../business-templates/Checkout/checkoutStore'
import { parseToCurrency } from 'app-helpers'
import { FDSSelect } from '../../components/FDSSelect'
import { shallow } from 'zustand/shallow'
import { Icon } from '../../components/atoms/NavigationButton'
import { customerRoute } from '../../routes'
import { useGetClientSession } from '../../hooks'
import { SuccessAnimation } from '../../components/SuccessAnimation'
import { clearClientCookies } from '../../cookies'

export const CheckoutScreen = () => {
  const router = useRouter()
  const { checkoutId, businessId } = router.query
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    },
    onCompleted: () => {
      showToast({
        message: t("successRequestingfullCheckout"),
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
      pathname: customerRoute.split,
      query: {
        businessId,
        checkoutId
      }
    })
  }, [businessId, checkoutId, router])

  const endSession = useCallback(() => {
    if (!businessId) throw new Error("Missing businessId")

    clearClientCookies(typeof businessId === "string" ? businessId : businessId[0])

    router.push({
      pathname: customerRoute.home,
      query: {
        businessId
      }
    })

  }, [businessId, router])

  return (
    <>
      {!splitType ?
        <Box flex={1}>
          <Box flex="1">
            <PastOrdersList />
          </Box>
          <Box>
            <OrderTotals />
            <HStack space={"4"} p={4}>
              <Button
                _text={{ bold: true }}
                flex={1}
                colorScheme={"primary"}
                isDisabled={!checkoutId || !clientData?.getClientSession.tab?.checkout}
                isLoading={loading}
                onPress={pay}>
                {t("finalize")}
              </Button>
              {!!clientData?.getClientSession.tab?.users?.length &&
                clientData?.getClientSession.tab?.users?.length > 1 ? (
                <Button
                  _text={{ bold: true }}
                  flex={1}
                  colorScheme={"tertiary"}
                  onPress={navigateToSplit}>{t("split")}</Button>
              ) : null}
            </HStack>
          </Box>
        </Box> :
        <>
          <PastOrdersModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
          <Box flex={1}>
            <Box flex={1}>
              <Center p={"4"}>
                <Box pt={8} pb={12}>
                  <Image src="/images/fasto-logo.svg"
                    alt="Fasto Logo"
                    height={36} width={180} />
                </Box>
                <Box size={"24"}>
                  <SuccessAnimation />
                </Box>
                <Text textAlign={"center"} fontSize={"lg"} mt={8}>{t("successMessage")}</Text>
              </Center>
            </Box>
            <VStack p={4} space={2}>
              <HStack justifyContent={"space-between"}>
                <Text fontSize="lg" fontWeight="bold">{t("splitType")}</Text>
                <Text fontSize="lg" fontWeight="bold">{t(splitType)}</Text>
              </HStack>
              <Divider />
              <HStack justifyContent={"space-between"}>
                <Text fontSize="lg" fontWeight="bold">{t("totalAmount")}</Text>
                <Text fontSize="lg" fontWeight="bold">{parseToCurrency(data.getCheckoutByID.total)}</Text>
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
              >
                {t("endSession")}
              </Button>
              <Button
                flex={1}
                colorScheme={"tertiary"}
                onPress={() => setIsModalOpen(true)}>
                {t("seeOrder")}
              </Button>
            </HStack>
          </Box>
        </>
      }
    </>
  )
}

export const OrderTotals = () => {
  const [show, setShow] = useState(true)

  const router = useRouter()
  const { checkoutId } = router.query

  const { t } = useTranslation('customerCheckout')
  const { absoluteTotal, tipCalculation } = useComputedChekoutStore()

  const { setSelectedTip, selectedTip, total, setCustomTip, customTip, setTotal } = useCheckoutStore(state => ({
    setSelectedTip: state.setSelectedTip,
    selectedTip: state.selectedTip,
    total: state.total,
    setCustomTip: state.setCustomTip,
    customTip: state.customTip,
    setTotal: state.setTotal,
  }),
    shallow
  )

  const { loading } = useGetCheckoutByIdQuery({
    skip: !checkoutId,
    pollInterval: 1000 * 60 * 2,
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
      }
    },
  })


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
        <Text fontSize={"xl"} bold>{parseToCurrency(absoluteTotal)}</Text>
      </HStack>
    </Box>
  )
}
