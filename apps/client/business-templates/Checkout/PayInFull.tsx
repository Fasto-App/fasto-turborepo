import { formatAsPercentage, getPercentageOfValue } from 'app-helpers'
import { Box, Button, Center, Divider, Heading, HStack, Input, Text, VStack } from 'native-base'
import React, { SetStateAction, useCallback, useMemo } from 'react'
import { FDSSelect, SelectData } from '../../components/FDSSelect'
import { parseToCurrency } from 'app-helpers'
import { Percentages, percentages, percentageSelectData, useCheckoutStore, useComputedChekoutStore } from './checkoutStore'
import { Checkout } from './types'
import { GetCheckoutByIdDocument, useGetTabCheckoutByIdQuery, useMakeCheckoutFullPaymentMutation, useMakeCheckoutPaymentMutation } from '../../gen/generated'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { SummaryRow } from './Checkout'
import { showToast } from '../../components/showToast'

export const PayInFull = ({
  subTotal,
  tax,
  setSelectedOption,
}: Checkout & { setSelectedOption: (value: React.SetStateAction<"splitBill" | "success" | "payFull">) => void }) => {

  const route = useRouter()
  const { tabId, checkoutId } = route.query

  const [selectedUser, setSelectedUser] = React.useState<string>()
  const { t } = useTranslation("businessCheckout")

  const { data } = useGetTabCheckoutByIdQuery({
    skip: !tabId,
    variables: {
      input: {
        _id: tabId as string
      }
    },
    onCompleted(data) {
      setSelectedUser(data?.getTabByID?.users?.[0]._id)
    },
  })

  const allUsersFromTab = useMemo(() => data?.getTabByID?.users?.map((user, i) => ({
    _id: user._id,
    value: `${t("person")} ${++i}`
  })) ?? [], [data?.getTabByID?.users, t])


  const { total, tip, discount, setSelectedTip, setSelectedDiscount, selectedDiscount, selectedTip, customTip, setCustomTip, setCustomDiscount, customDiscount } = useCheckoutStore(state => ({
    tip: state.tip,
    discount: state.discount,
    setSelectedTip: state.setSelectedTip,
    setSelectedDiscount: state.setSelectedDiscount,
    selectedTip: state.selectedTip,
    selectedDiscount: state.selectedDiscount,
    customTip: state.customTip,
    customDiscount: state.customDiscount,
    setCustomTip: state.setCustomTip,
    setCustomDiscount: state.setCustomDiscount,
    total: state.total,
  }))

  const {
    absoluteTotal,
    tipCalculation,
    discountCalculation,
  } = useComputedChekoutStore()

  const [makeCheckoutPayment, { loading }] = useMakeCheckoutFullPaymentMutation({
    onCompleted: (data) => {
      if (data.makeCheckoutFullPayment.paid) {
        setSelectedOption("success")
      }
    },
    onError: (error) => {
      showToast({
        message: "error.message",
        status: "error"
      })

    },
    refetchQueries: [{
      query: GetCheckoutByIdDocument,
      variables: {
        input: {
          _id: checkoutId as string
        }
      }
    }],
  })

  const handlePay = useCallback(async () => {
    if (!selectedUser) throw new Error("No user selected")

    await makeCheckoutPayment({
      variables: {
        input: {
          patron: selectedUser,
          checkout: checkoutId as string,
          amount: total,
          tip,
          discount,
          paymentMethod: "Cash",
        }
      }
    })
  }, [checkoutId, discount, makeCheckoutPayment, selectedUser, tip, total])

  return (
    <Center>
      <VStack w={"full"} minW={"lg"} space={4}>
        <SummaryRow label={t("subtotal")} value={parseToCurrency(subTotal)} />
        <SummaryRow label={t("feesAndTax")} value={parseToCurrency(subTotal ? (tax ?? 0 * subTotal ?? 0) : 0)} />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"xl"}>{t("discount")}</Text>
          <HStack space={2} alignItems={"self-end"}>
            <FDSSelect
              w={100} h={10}
              array={percentageSelectData}
              selectedValue={selectedDiscount}
              setSelectedValue={(string) => setSelectedDiscount(string as Percentages)}
            />
            {selectedDiscount === "Custom" ?
              <Input
                w={100} h={10}
                fontSize={"lg"}
                textAlign={"right"}
                value={(customDiscount / 100)
                  .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                onChangeText={(value) => {
                  const text = value.replace(/[$,.]/g, '');
                  const convertedValue = Number(text);

                  if (isNaN(convertedValue)) return

                  return setCustomDiscount(convertedValue)
                }}
              />
              :
              <Text
                textAlign={"right"}
                alignSelf={"center"}
                w={100} fontSize={"lg"}>
                {parseToCurrency(discountCalculation)}
              </Text>}
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"xl"}>{t("tip")}</Text>
          <HStack space={2} alignItems={"self-end"}>
            <FDSSelect
              w={100} h={10}
              array={percentageSelectData}
              selectedValue={selectedTip}
              setSelectedValue={(string) => setSelectedTip(string as Percentages)}
            />
            {selectedTip === "Custom" ?
              <Input
                w={100} h={10}
                fontSize={"lg"}
                textAlign={"right"}
                value={(customTip / 100)
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
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"xl"}>{t("paymentBy")}</Text>
          <FDSSelect
            array={allUsersFromTab}
            selectedValue={selectedUser}
            setSelectedValue={(string) => setSelectedUser(string)}
          />
        </HStack>
        <Divider marginY={6} />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"3xl"} bold>{t("total")}</Text>
          <Text fontSize={"3xl"} bold>{parseToCurrency(absoluteTotal)}</Text>
        </HStack>
        <Box alignItems={"center"} px={'24'} py={8}>
          <Button
            isLoading={loading}
            w={"full"}
            colorScheme={"tertiary"}
            onPress={handlePay}
          >
            {t("pay")}
          </Button>
        </Box>
      </VStack>
    </Center>
  )
}
