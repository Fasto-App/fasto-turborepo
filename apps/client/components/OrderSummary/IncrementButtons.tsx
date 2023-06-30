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
  disabled?: boolean;
}

export const IncrementButtons = (props: IncrementButtonsProps) => {
  const { quantity, onPlusPress, onMinusPress, disabled } = props

  return (
    <HStack alignItems={"center"} space={2} opacity={disabled ? 50 : undefined}>
      <StyledIconButton type={"minus"} onPress={disabled ? () => { } : onMinusPress} />
      <Text
        fontSize={quantity > 99 ? 12 : 16}
        alignSelf={"center"}
        textAlign={"center"}
        w={quantity > 99 ? 6 : 5}>{quantity}</Text>
      <StyledIconButton type="plus" onPress={disabled ? () => { } : onPlusPress} />
    </HStack>
  )
}
