import React from 'react'
import { AddIcon, HStack, IconButton, MinusIcon, Text } from "native-base"

const StyledIconButton = ({ type, onPress }: { type: "plus" | "minus", onPress?: () => void }) => {
  const Icon = type === "plus" ? AddIcon : MinusIcon
  return (
    <IconButton
      size={7}
      borderRadius="md"
      onPress={onPress}
      variant={"subtle"}
      backgroundColor={"primary.500"}
      icon={<Icon color={"white"} size={4} />}
    />
  )
};

type IncrementButtonsProps = {
  quantity: number;
  onPlusPress?: () => void;
  onMinusPress?: () => void;
}

export const IncrementButtons = (props: IncrementButtonsProps) => {
  const { quantity, onPlusPress, onMinusPress } = props

  return (
    <HStack space={2}>
      <StyledIconButton type={"minus"} onPress={onMinusPress} />
      <Text
        fontSize={16}
        alignSelf={"center"}
        textAlign={"center"}
        w={5}>{quantity}</Text>
      <StyledIconButton type="plus" onPress={onPlusPress} />
    </HStack>
  )
}
