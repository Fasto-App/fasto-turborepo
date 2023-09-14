import React from "react"
import { Button, HStack } from "native-base"
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("businessCategoriesProducts")

  return (
    <HStack space={2}>
      <Button
        width={"100"}
        variant={"ghost"}
        onPress={allAction}
        colorScheme="lightBlue"
      >
        {t("all")}
      </Button>

      <Button
        disabled={!categoryId}
        isDisabled={!categoryId}
        variant={"ghost"}
        width={"100px"}
        colorScheme="lightBlue"
        onPress={() => editAction(categoryId)}>
        {t("edit")}
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