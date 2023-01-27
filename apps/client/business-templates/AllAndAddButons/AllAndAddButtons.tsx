import React from "react"
import { Button, HStack } from "native-base"

const texts = {
  edit: "Edit",
  all: "All",
}

type AllAndEditButtonsProps = {
  allAction: () => void;
  editAction: (categoryId?: string | null) => void;
  categoryId?: string | null;
}

export const AllAndEditButtons = ({
  allAction,
  editAction,
  categoryId
}: AllAndEditButtonsProps) => {
  return (
    <HStack space={2}>
      <Button
        width={"100"}
        variant={"outline"}
        onPress={allAction}
      >
        {texts.all}
      </Button>

      <Button
        disabled={!categoryId}
        isDisabled={!categoryId}

        width={"100px"}
        colorScheme="tertiary"
        onPress={() => editAction(categoryId)}>
        {texts.edit}
      </Button>
    </HStack>
  )
}

type SideBySideButtonsProps = {
  leftAction: () => void;
  rightAction: () => void;
  leftText: string;
  rightText: string;
  leftDisabled: boolean;
  rightDisabled: boolean;
}

export const SideBySideButtons = ({
  leftAction,
  rightAction,
  leftText,
  rightText,
  leftDisabled,
  rightDisabled,
}: SideBySideButtonsProps) => {
  return (
    <HStack space={2}>
      <Button
        colorScheme={"primary"}
        width={"100px"}
        onPress={leftAction}
        isDisabled={leftDisabled}
      >
        {leftText}
      </Button>

      <Button
        width={"100px"}
        colorScheme="tertiary"
        onPress={rightAction}
        isDisabled={rightDisabled}
      >
        {rightText}
      </Button>
    </HStack>
  )
};