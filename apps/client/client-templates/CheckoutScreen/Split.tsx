import { typedKeys, splitTypes } from 'app-helpers'
import { HStack, Checkbox, Text, Box, Divider, Radio } from 'native-base'
import React from 'react'
import { useCheckoutStore } from '../../business-templates/Checkout/checkoutStore'
import { shallow } from 'zustand/shallow'

export const Split = () => {
  const { selectedSplitType, setSelectedSplitType } = useCheckoutStore(state => ({
    setSelectedSplitType: state.setSelectedSplitType,
    selectedSplitType: state.selectedSplitType,
  }),
    shallow
  )

  return (
    <Box pt={4}>
      <Radio.Group name="myRadioGroup"
        accessibilityLabel="favorite number"
        // @ts-ignore
        onChange={setSelectedSplitType}
        value={selectedSplitType}
        direction={"row"}
        display={"flex"}
      >
        <HStack space={4} py={2} width={"100%"}
          justifyContent={"center"}
        >
          {typedKeys(splitTypes).map((splitType) => {
            return (
              <Radio key={splitType} value={splitType} >
                {splitType}
              </Radio>
            )
          })}
        </HStack>
      </Radio.Group>
      {new Array(5).fill(0).map((_, i) => (
        <HStack key={i} pt={4} px={4} justifyContent={"space-between"}>
          <Checkbox value="one">
            John Doe
          </Checkbox>

          <Text fontSize={"lg"}>
            $19.00
          </Text>
        </HStack>))}
      <Divider marginY={2} />
    </Box>
  )
}
