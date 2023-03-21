import { Box, IBoxProps } from 'native-base'
import React from 'react'

export const OrangeBox = ({ height = 100 }: { height?: IBoxProps["h"] }) => {
  return (
    <Box
      backgroundColor={"primary.500"}
      h={height}
      w={"100%"}
      position={"absolute"}
      zIndex={-1}
    />
  )
}
