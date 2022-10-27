import React from "react"
import { Button, HStack } from "native-base"

const texts = {
  edit: "Edit",
  all: "All",
}

export const AllAndEditButtons = ({
  allAction,
  editAction,
  categoryId
}) => {
  return (
    <HStack>
      <Button
        ml={2}
        width={"100px"}
        variant={"outline"}
        onPress={allAction}
      >
        {texts.all}
      </Button>

      <Button
        disabled={!categoryId}
        isDisabled={!categoryId}
        ml={2}
        width={"100px"}
        colorScheme="tertiary"
        onPress={() => editAction(categoryId)}>
        {texts.edit}
      </Button>
    </HStack>
  )
}

export const SideBySideButtons = ({
  leftAction,
  rightAction,
  leftText,
  rightText,
  leftDisabled,
  rightDisabled,
}) => {
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