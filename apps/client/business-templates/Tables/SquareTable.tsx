import React from "react"
import { Box, Center, Heading } from "native-base"
import { AiOutlinePlus } from "react-icons/ai"
import { Pressable } from "react-native"
import { TableStatus } from "../../gen/generated"
import { borderColor } from "./config"

export const SquareTable = ({ index, status, onPress, isButton = false }:
  { index?: number, status?: TableStatus, onPress: () => void, isButton?: boolean }) => {

  return (
    <Pressable
      onPress={onPress}
    >
      <Box
        h={"48"}
        w={"48"}
        mb={4}
        borderWidth={isButton ? 1 : 4}
        borderRadius={"md"}
        justifyContent="center"
        alignItems={"center"}
        borderColor={isButton ? "muted.500" : borderColor(status)}
      >
        {isButton ?
          <Center size={16} borderWidth={3} borderRadius={"full"}>
            <AiOutlinePlus size={"5em"} />
          </Center>
          :
          <Heading color={borderColor(status)}>
            {index ? index++ : 1}
          </Heading>}
      </Box>
    </Pressable>)
}