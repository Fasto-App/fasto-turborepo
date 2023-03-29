import { formatAsPercentage, getPercentageOfValue } from 'app-helpers'
import { Button, Center, Divider, Heading, HStack, Input, Text, VStack } from 'native-base'
import React, { useCallback, useMemo } from 'react'
import { FDSSelect, SelectData } from '../../components/FDSSelect'
import { parseToCurrency } from 'app-helpers'
import { Percentages, percentages, percentageSelectData, useCheckoutStore } from './checkoutStore'
import { texts } from './texts'
import { Checkout } from './types'
import { GetCheckoutByIdDocument, useGetTabCheckoutByIdQuery, useMakeCheckoutPaymentMutation } from '../../gen/generated'
import { useRouter } from 'next/router'

export const PayInFull = ({
  subTotal,
  tax,
}: Checkout) => {

  const route = useRouter()
  const { tabId, checkoutId } = route.query

  const [selectedUser, setSelectedUser] = React.useState<string>()

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


  const { tip, discount, setSelectedTip, setSelectedDiscount, selectedDiscount, selectedTip, customTip, setCustomTip, setCustomDiscount, customDiscount } = useCheckoutStore(state => ({
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
  }))

  const formatedTip = selectedTip === "Custom" ? "Custom" : formatAsPercentage(tip)
  const formatedDiscount = selectedDiscount === "Custom" ? "Custom" : formatAsPercentage(discount)
  const tipFieldValue = selectedTip === "Custom" ?
    parseToCurrency(customTip) :
    parseToCurrency(getPercentageOfValue(subTotal, tip))
  const discountValue = getPercentageOfValue(subTotal, discount)

  const discountFieldValue = selectedDiscount === "Custom" ?
    parseToCurrency(customDiscount) :
    parseToCurrency(discountValue)

  const total = useMemo(() => {
    const discountAmount = getPercentageOfValue(subTotal, discount)
    const tipAmount = getPercentageOfValue(subTotal, tip)

    return (subTotal ?? 0) - discountAmount + tipAmount
  }, [subTotal, tip, discount])

  const handleDiscountChange = (value: string) => {
    const text = value.replace(/[$,.]/g, '')
    const convertedValue = Number(text)
    if (Number.isInteger(convertedValue)) {
      setCustomDiscount(convertedValue, subTotal)
    }
  }

  const handleTipChange = (value: string) => {
    const text = value.replace(/[$,.]/g, '')
    const convertedValue = Number(text)
    if (Number.isInteger(convertedValue)) {
      setCustomTip(convertedValue, subTotal)
    }
  }

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
        {texts.checkout}
      </Heading>
      <VStack w={"70%"} minW={"lg"} space={4}>
        <Divider />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.subtotal}</Text>
          <Text fontSize={"2xl"}>{parseToCurrency(subTotal)}</Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.feesAndTax}</Text>
          <Text fontSize={"2xl"}>{parseToCurrency(subTotal ? (tax ?? 0 * subTotal ?? 0) : 0)}
          </Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.discount}</Text>
          <HStack space={2} alignItems={"self-end"}>
            <FDSSelect
              array={percentageSelectData}
              selectedValue={formatedDiscount}
              setSelectedValue={(string) => setSelectedDiscount(string as Percentages)}
            />
            <Input
              h={"6"}
              w={100}
              value={discountFieldValue}
              isDisabled={selectedDiscount === "Custom" ? false : true}
              textAlign={"right"}
              onChangeText={handleDiscountChange}
            />
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.tip}</Text>
          <HStack space={2} alignItems={"self-end"}>
            <FDSSelect
              array={percentageSelectData}
              selectedValue={formatedTip}
              setSelectedValue={(string) => setSelectedTip(string as Percentages)}
            />
            <Input
              h={"6"}
              value={tipFieldValue}
              w={100}
              isDisabled={selectedTip === "Custom" ? false : true}
              textAlign={"right"}
              onChangeText={handleTipChange}
            />
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.paymentBy}</Text>
          <FDSSelect
            array={allUsersFromTab}
            selectedValue={selectedUser}
            setSelectedValue={(string) => setSelectedTip(string as Percentages)}
          />
        </HStack>
        <Divider marginY={6} />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"3xl"} bold>{texts.total}</Text>
          <Text fontSize={"3xl"} bold>{parseToCurrency(total)}</Text>
        </HStack>
        <Button
          isLoading={loading}
          w={"full"}
          mb={4}
          mt={6}
          colorScheme={"tertiary"}
          onPress={handlePay}
        >
          {texts.pay}
        </Button>
      </VStack>
    </Center>
  )
}
