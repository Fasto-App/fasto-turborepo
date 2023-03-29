import { HStack, Divider, Text } from 'native-base'
import React from 'react'
import { percentageSelectData } from '../../business-templates/Checkout/checkoutStore'
import { FDSSelect } from '../../components/FDSSelect'

export const PayTable = () => {
  return (
    <>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Subtotal"}</Text>
        <Text fontSize={"lg"}>{"$19.00"}</Text>
      </HStack>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Taxes"}</Text>
        <Text fontSize={"lg"}>{"$19.00"}</Text>
      </HStack>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Tip"}</Text>

        <HStack space={2}>
          <FDSSelect
            array={percentageSelectData}
            selectedValue={undefined}
            setSelectedValue={() => { console.log("setSelectedValue") }}
          />
          <Text fontSize={"lg"}>{"$19.00"}</Text>
        </HStack>
      </HStack>
      <Divider marginY={2} />
      <HStack justifyContent={"space-between"} pt={2} px={4}>
        <Text fontSize={"xl"} bold>{"total"}</Text>
        <Text fontSize={"xl"} bold>{"$19.00"}</Text>
      </HStack>
    </>
  )
}
