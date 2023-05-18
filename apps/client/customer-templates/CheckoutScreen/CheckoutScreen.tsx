import { Box, Button, Divider, HStack, Text, Input, Pressable } from 'native-base'
import { useTranslation } from "next-i18next"
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useGetCheckoutByIdQuery } from '../../gen/generated'
import { showToast } from '../../components/showToast'
import { PastOrdersList } from '../CartScreen/PastOrdersModal'
import { percentageSelectData, useCheckoutStore, useComputedChekoutStore } from '../../business-templates/Checkout/checkoutStore'
import { parseToCurrency } from 'app-helpers'
import { FDSSelect } from '../../components/FDSSelect'
import { shallow } from 'zustand/shallow'
import { Icon } from '../../components/atoms/NavigationButton'
import { customerRoute } from '../../routes'

export const CheckoutScreen = () => {
  const router = useRouter()
  const { checkoutId, businessId } = router.query

  const { t } = useTranslation('customerCheckout')

  const { setTotal, } = useCheckoutStore(state => ({
    setTotal: state.setTotal,
  }),
    shallow
  )

  const pay = () => {
    alert(`Pagar`)
  }

  const navigateToSplit = () => {
    if (!checkoutId || !businessId) return

    router.push(customerRoute.split(businessId as string, checkoutId as string))
  }

  return (
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
            onPress={pay}>{t("finalize")}</Button>
          <Button
            _text={{ bold: true }}
            flex={1}
            colorScheme={"tertiary"}
            onPress={navigateToSplit}>{t("split")}</Button>
        </HStack>
      </Box>
    </Box>
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
        message: "Error fetching checkout information",
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
        <Text fontSize={"xl"} bold>{t('total')}</Text>
        <Text fontSize={"xl"} bold>{parseToCurrency(absoluteTotal)}</Text>
      </HStack>
    </Box>
  )
}
