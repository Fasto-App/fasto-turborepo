import React from "react"
import { Box, Center, Heading, Pressable } from "native-base"
import { AiOutlinePlus } from "react-icons/ai"
import { TableStatus } from "../../gen/generated"
import { borderColor } from "./config"

type SquareTableProps = {
  status?: TableStatus;
  onPress: () => void;
  tableNumber?: string;
}

export const PlusButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable onPress={onPress}>
    <Box
      h={"48"}
      w={"48"}
      mb={4}
      borderWidth={1}
      borderRadius={"md"}
      justifyContent="center"
      alignItems={"center"}
      borderColor={"muted.500"}
    >
      <Center size={16} borderWidth={3} borderRadius={"full"}>
        <AiOutlinePlus size={"5em"} />
      </Center>
    </Box>
  </Pressable>
)

export const SquareTable = ({ status, onPress, tableNumber }: SquareTableProps) => (
  <Pressable onPress={onPress}>
    <Box
      h={"48"}
      w={"48"}
      mb={4}
      borderWidth={4}
      borderRadius={"md"}
      justifyContent="center"
      alignItems={"center"}
      borderColor={borderColor(status)}
    >
      <Heading color={borderColor(status)}>
        {tableNumber}
      </Heading>
    </Box>
  </Pressable>)