import React from "react"
import { Button, HStack } from "native-base"

type SideBySideButtonsProps = {
  leftAction: () => void;
  rightAction: () => void;
  leftText: string;
  rightText: string;
  leftDisabled: boolean;
  rightDisabled: boolean;
  leftLoading?: boolean;
  rightLoading?: boolean;
}

export const SideBySideButtons = ({
  leftAction,
  rightAction,
  leftText,
  rightText,
  leftDisabled,
  rightDisabled,
  leftLoading,
  rightLoading
}: SideBySideButtonsProps) => {
  return (
    <HStack space={2}>
      <Button
        colorScheme={"primary"}
        width={"100px"}
        onPress={leftAction}
        isDisabled={leftDisabled}
        isLoading={leftLoading}
      >
        {leftText}
      </Button>

      <Button
        width={"100px"}
        colorScheme="tertiary"
        onPress={rightAction}
        isDisabled={rightDisabled}
        isLoading={rightLoading}
      >
        {rightText}
      </Button>
    </HStack>
  )
};