import { HStack, Checkbox, Text, Box, Divider } from 'native-base'
import React from 'react'

export const Split = () => {
  return (
    <Box>
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
