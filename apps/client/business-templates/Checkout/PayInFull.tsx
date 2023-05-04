import { formatAsPercentage, getPercentageOfValue } from 'app-helpers'
import { Button, Center, Divider, Heading, HStack, Input, Text, VStack } from 'native-base'
import React, { useCallback, useMemo } from 'react'
import { FDSSelect, SelectData } from '../../components/FDSSelect'
import { parseToCurrency } from 'app-helpers'
import { Percentages, percentages, percentageSelectData, useCheckoutStore, useComputedChekoutStore } from './checkoutStore'
import { Checkout } from './types'
import { GetCheckoutByIdDocument, useGetTabCheckoutByIdQuery, useMakeCheckoutPaymentMutation } from '../../gen/generated'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export const PayInFull = ({
  subTotal,
  tax,
}: Checkout) => {

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

  const allUsersFromTab = useMemo(() => data?.getTabByID?.users?.map(user => ({
    _id: user._id,
    value: user._id
  })) ?? [], [data?.getTabByID?.users])


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

  const [makeCheckoutPayment, { loading }] = useMakeCheckoutPaymentMutation({
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
    if (!selectedUser) return
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
      <Heading size={"2xl"} p={4}>
        {t("checkout")}
      </Heading>
      <VStack w={"70%"} minW={"lg"} space={4}>
        <Divider />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{t("subtotal")}</Text>
          <Text fontSize={"lg"}>{parseToCurrency(subTotal)}</Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{t("feesAndTax")}</Text>
          <Text fontSize={"lg"}>{parseToCurrency(subTotal ? (tax ?? 0 * subTotal ?? 0) : 0)}
          </Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{t("discount")}</Text>
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
          <Text fontSize={"2xl"}>{t("tip")}</Text>
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
          <Text fontSize={"2xl"}>{t("paymentBy")}</Text>
          <FDSSelect
            array={allUsersFromTab}
            selectedValue={selectedUser}
            setSelectedValue={(string) => setSelectedTip(string as Percentages)}
          />
        </HStack>
        <Divider marginY={6} />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"3xl"} bold>{t("total")}</Text>
          <Text fontSize={"3xl"} bold>{parseToCurrency(absoluteTotal)}</Text>
        </HStack>
        <Button
          isLoading={loading}
          w={"full"}
          mb={4}
          mt={6}
          colorScheme={"tertiary"}
          onPress={handlePay}
        >
          {t("pay")}
        </Button>
      </VStack>
    </Center>
  )
}
