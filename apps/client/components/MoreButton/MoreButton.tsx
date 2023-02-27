import React from "react"
import { Box, Button } from "native-base"
import { AiOutlinePlus } from "react-icons/ai"

export const MoreButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      maxH={"40px"}
      borderWidth={1}
      colorScheme="primary"
      variant={"outline"}
      onPress={onPress}>
      <Box borderWidth={1} borderRadius={'full'} justifyContent="center" alignItems={"center"} >
        <AiOutlinePlus size={"1em"} />
      </Box>
    </Button>
  )
}