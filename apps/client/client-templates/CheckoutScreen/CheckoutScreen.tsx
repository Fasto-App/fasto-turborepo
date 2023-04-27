import { Box, Button, Divider, HStack, VStack, Text, Input, ScrollView } from 'native-base'
import { useTranslation } from "next-i18next"
import React, { useState } from 'react'
import { FDSTab, TabsType } from '../../components/FDSTab'
import { Split } from './Split'
import { useRouter } from 'next/router'
import { useGetCheckoutByIdQuery } from '../../gen/generated'
import { showToast } from '../../components/showToast'
import { PastOrdersModal } from '../CartScreen/PastOrdersModal'
import { percentageSelectData, useCheckoutStore, useComputedChekoutStore } from '../../business-templates/Checkout/checkoutStore'
import { parseToCurrency } from 'app-helpers'
import { FDSSelect } from '../../components/FDSSelect'
import { shallow } from 'zustand/shallow'

export const CheckoutScreen = () => {
  const router = useRouter()
  const { checkoutId } = router.query

  const { t } = useTranslation('clientCheckout')
  const [selectedTab, setSelectedTab] = useState("payTable");
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabs: TabsType = {
    payTable: t('payTable'),
    split: t("split"),
  }

  const { setTotal, setSelectedTip, selectedTip, total, setCustomTip, customTip, tip } = useCheckoutStore(state => ({
    setSelectedTip: state.setSelectedTip,
    selectedTip: state.selectedTip,
    total: state.total,
    setTotal: state.setTotal,
    setCustomTip: state.setCustomTip,
    tip: state.tip,
    customTip: state.customTip,
  }),
    shallow
  )

  const { absoluteTotal, tipCalculation } = useComputedChekoutStore()

  const { data } = useGetCheckoutByIdQuery({
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
      // if the cehckout has the split option, we should switch here
    },
  })

  const pay = () => {
    console.log("pay")
    console.log(data)
    alert(`Pagar ${parseToCurrency(absoluteTotal)} com tip de ${(tip)}`)
    // mutation will create Payments while updating the checkout
    // all users should be subscribed to the checkout
    // type of Payment: Split, Full, Tip, Refund, etc
  }

  return (
    <Box flex={1}>
      <PastOrdersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Box px={2}>
        <FDSTab
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </Box>
      <ScrollView flex={1} px={4}>
        <HStack justifyContent={"space-between"} pt={4} px={4}>
          <Text fontSize={"lg"}>{t("subtotal")}</Text>
          <Text fontSize={"lg"}>{parseToCurrency(total)}</Text>
        </HStack>
        <HStack justifyContent={"space-between"} pt={4} px={4}>
          <Text fontSize={"lg"}>{t("taxes")}</Text>
          <Text fontSize={"lg"}>{parseToCurrency(data?.getCheckoutByID.tax)}</Text>
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
        <Divider marginY={4} />
        {selectedTab === "split" ? <Split /> : null}
      </ScrollView>
      <Box>
        <Divider marginY={4} />
        <HStack justifyContent={"space-between"} pt={2} px={4}>
          <Text fontSize={"xl"} bold>{t('total')}</Text>
          <Text fontSize={"xl"} bold>{parseToCurrency(absoluteTotal)}</Text>
        </HStack>
        {
          selectedTab === "split" ? <>
            <HStack justifyContent={"space-between"} pt={2} px={4}>
              <Text fontSize={"lg"} bold>{t("due")}</Text>
              <Text fontSize={"lg"} bold>{parseToCurrency(absoluteTotal)}</Text>
            </HStack>

            <HStack justifyContent={"space-between"} pt={2} px={4}>
              <Text fontSize={"lg"} bold>{t("paid")}</Text>
              <Text fontSize={"lg"} bold>{parseToCurrency(0)}</Text>
            </HStack>
          </> : null
        }
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
            onPress={() => setIsModalOpen(true)}>{t("seeCheck")}</Button>
        </HStack>
      </Box>
    </Box>
  )
}
