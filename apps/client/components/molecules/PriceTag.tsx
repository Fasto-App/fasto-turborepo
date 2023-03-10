import { Box, Text } from 'native-base'
import React from 'react'

export const PriceTag = ({ price }: { price: string }) => {
  return (
    <Box bgColor={"white"}
      borderRadius={"5"}
      position={"absolute"}
      top={1}
      right={1}
      p={0.5}
    >
      <Text
        fontSize={"16"}
        fontWeight={"700"}
      >
        {price}
      </Text>
    </Box>
  )
}
