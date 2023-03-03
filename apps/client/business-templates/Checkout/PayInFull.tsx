import { formatAsPercentage } from 'app-helpers'
import { Button, Center, Divider, Heading, HStack, Input, Text, VStack } from 'native-base'
import React, { useMemo } from 'react'
import { FDSSelect } from '../../components/FDSSelect'
import { parseToCurrency } from '../../utils'
import { Percentages, percentages, useCheckoutStore } from './checkoutStore'
import { texts } from './texts'
import { Checkout } from './types'

export const PayInFull = ({
  subTotal,
  tax,
  totalPaid
}: Checkout) => {

  const { tip, discount, setSelectedTip, setSelectedDiscount, selectedDiscount, selectedTip, customTip, setCustomTip, setCustomDiscount } = useCheckoutStore(state => ({
    tip: state.tip,
    discount: state.discount,
    setSelectedTip: state.setSelectedTip,
    setSelectedDiscount: state.setSelectedDiscount,
    selectedTip: state.selectedTip,
    selectedDiscount: state.selectedDiscount,
    customTip: state.customTip,
    setCustomTip: state.setCustomTip,
    setCustomDiscount: state.setCustomDiscount,
  }))

  const formatedTip = selectedTip === "Custom" ? "Custom" : formatAsPercentage(tip)
  const formatedDiscount = selectedDiscount === "Custom" ? "Custom" : formatAsPercentage(discount)
  const tipFieldValue = selectedTip === "Custom" ? parseToCurrency(customTip) : parseToCurrency(tip * (subTotal ?? 0))
  const total = useMemo(() => {
    const discountAmount = (discount * (subTotal ?? 0))
    const tipAmount = (tip * (subTotal ?? 0))
    return parseToCurrency((subTotal ?? 0) - discountAmount + tipAmount)
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
          <Text fontSize={"2xl"}>{parseToCurrency(subTotal ? (tax ?? 0 * subTotal ?? 0) : 0)}</Text>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"2xl"}>{texts.discount}</Text>
          <HStack space={2} alignItems={"self-end"}>
            <FDSSelect
              array={percentages}
              selectedValue={formatedDiscount}
              setSelectedValue={(string) => setSelectedDiscount(string as Percentages)}
            />
            <Input
              h={"6"}
              w={100}
              value={parseToCurrency(discount * (subTotal ?? 0))}
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
              array={percentages}
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
        <Divider marginY={6} />
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"3xl"} bold>{texts.total}</Text>
          <Text fontSize={"3xl"} bold>{total}</Text>
        </HStack>
        <Button
          w={"full"}
          onPress={() => console.log("View Summary")}
          mb={4}
          mt={6}
          colorScheme={"tertiary"}
        >
          {texts.pay}
        </Button>
      </VStack>
    </Center>
  )
}
