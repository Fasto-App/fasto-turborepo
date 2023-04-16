import { HStack, Divider, Text, Input, Box } from 'native-base'
import React from 'react'
import { Percentages, percentageSelectData, useCheckoutStore } from '../../business-templates/Checkout/checkoutStore'
import { FDSSelect } from '../../components/FDSSelect'
import { formatAsPercentage, getPercentageOfValue, parseToCurrency } from 'app-helpers'
import { useForm } from 'react-hook-form'

type PayTableProps = {
  subtotal: number
  taxes: number
  tip: number
  total: number
}

export const PayTable = (props: PayTableProps) => {
  // todo: extract logic from business

  const { tip, setSelectedTip, selectedTip, customTip, setCustomTip } = useCheckoutStore(state => ({
    tip: state.tip,
    setSelectedTip: state.setSelectedTip,
    selectedTip: state.selectedTip,
    customTip: state.customTip,
    setCustomTip: state.setCustomTip,
  }))

  const formatedTip = selectedTip === "Custom" ? "Custom" : formatAsPercentage(tip)

  const percentageOfTotal = getPercentageOfValue(props.subtotal, tip)

  const tipFieldValue = selectedTip === "Custom" ?
    parseToCurrency(customTip) :
    parseToCurrency(percentageOfTotal)

  const handleTipChange = (value: string) => {
    console.log("handle tip change")
    console.log(value)

    const text = value.replace(/[$,.]/g, '')

    console.log("text", text)

    const convertedValue = Number(text)

    if (Number.isInteger(convertedValue)) {

      console.log("convertedValue", convertedValue)
      setCustomTip(convertedValue, props.subtotal)
      return
    }
    console.log("not a number")

    setCustomTip(0, props.subtotal)
  }

  console.log("tip", tip)

  // total will be either the percentage of the value or the custom value
  const total = props.subtotal + props.taxes + (selectedTip === "Custom" ? customTip : percentageOfTotal)

  const { control } = useForm({
    defaultValues: {
      tip: tipFieldValue
    }
  })

  return (
    <>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Subtotal"}</Text>
        <Text fontSize={"lg"}>{parseToCurrency(props.subtotal)}</Text>
      </HStack>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Taxes"}</Text>
        <Text fontSize={"lg"}>{parseToCurrency(props.taxes)}</Text>
      </HStack>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Tip"}</Text>
        <HStack space={2}>
          <FDSSelect
            h={10} w={120}
            array={percentageSelectData}
            selectedValue={formatedTip}
            setSelectedValue={(str) => setSelectedTip(str as Percentages)}
          />
          {/* Not working well on iOS. Reduce the amount of re-renders with hook form */}
          <Input
            h="10"
            value={tipFieldValue}
            fontSize={"lg"}
            w={100}
            isDisabled={selectedTip !== "Custom"}
            isReadOnly={selectedTip !== "Custom"}
            _disabled={{ opacity: 0.7 }}
            textAlign={"right"}
            onChangeText={handleTipChange}
          />
        </HStack>
      </HStack>
      <Divider marginY={4} />
      <HStack justifyContent={"space-between"} pt={2} px={4}>
        <Text fontSize={"xl"} bold>{"Total"}</Text>
        <Text fontSize={"xl"} bold>{parseToCurrency(total)}</Text>
      </HStack>
    </>
  )
}
