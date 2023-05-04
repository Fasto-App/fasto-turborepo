import React from "react"
import { SplitType, parseToCurrency } from "app-helpers";
import { HStack, Box, Checkbox, Input, Text, Button } from "native-base";
import { FC } from "react";
import { useTranslation } from "next-i18next";

const Cell: FC<{ bold?: boolean, isDisabled?: boolean }> = ({ children, bold, isDisabled }) => {
  return (
    <Text
      w={100}
      alignSelf={"center"}
      textAlign={"center"}
      fontSize={"lg"}
      color={isDisabled ? "gray.300" : undefined}
      bold={bold}
    >
      {children}
    </Text>
  )
}

type HeaderProps = {
  type: SplitType,
  areAllUsersSelected: boolean,
  onCheckboxChange: (value: boolean) => void;
}

export const Header = ({ type, areAllUsersSelected, onCheckboxChange }: HeaderProps) => {
  const { t } = useTranslation("businessCheckout")

  return (
    <HStack py={2}>
      <Box justifyContent={"center"}>
        <Checkbox
          isChecked={areAllUsersSelected}
          colorScheme="green"
          value='user'
          onChange={onCheckboxChange}
        />
      </Box>
      <Cell bold>
        {t("patron")}
      </Cell>
      <Cell bold>
        {t("subtotal")}
      </Cell>
      {type === "ByPatron" ? <Cell bold>
        {t("sharedByTable")}
      </Cell> : null}
      <Cell bold>
        {t("feesAndTax")}
      </Cell>
      <Cell bold>
        {t("tip")}
      </Cell>
      <Cell bold>
        {t("total")}
      </Cell>
      <Box flex={1} />
    </HStack>
  )
}

type RowProps = {
  subTotal: string;
  total: string;
  tax: string;
  tip: string;
  sharedByTable: string;
  type: SplitType;
  user: string;
  isUserSelected: boolean;
  onCheckboxChange: (value: boolean) => void;
  customSubTotal: string;
  onCustominputChange: (value: string) => void;
  onPress: () => void;
  isLoading: boolean;
  hasUserPaid: boolean;
}

export const Row = ({
  type,
  subTotal,
  total,
  tip,
  sharedByTable,
  tax,
  user,
  isUserSelected,
  customSubTotal,
  isLoading,
  onPress,
  onCheckboxChange,
  onCustominputChange,
  hasUserPaid
}: RowProps) => {
  const { t } = useTranslation("businessCheckout")

  return (<HStack>
    <Box justifyContent={"center"}>
      <Checkbox
        isChecked={isUserSelected}
        colorScheme="green"
        value='user'
        onChange={onCheckboxChange}
      />
    </Box>
    <Cell isDisabled={!isUserSelected || hasUserPaid} key={"patron"}>
      {user}
    </Cell >
    {type === "Custom" ?
      <Input
        w={140}
        h={"6"}
        textAlign={"center"}
        onChangeText={onCustominputChange}
        value={isUserSelected ? customSubTotal : parseToCurrency(0)}
      /> :
      <Cell isDisabled={!isUserSelected || hasUserPaid} key={"subtotal"}>{isUserSelected ? subTotal : parseToCurrency(0)}</Cell>}
    {type === "ByPatron" ?
      <Cell isDisabled={!isUserSelected || hasUserPaid} key={"shared-by-table"}>
        {isUserSelected ? sharedByTable : parseToCurrency(0)}
      </Cell> : null
    }
    <Cell isDisabled={!isUserSelected || hasUserPaid} key={"fees-and-taxes"}>
      {isUserSelected ? tax : parseToCurrency(0)}
    </Cell>
    <Cell isDisabled={!isUserSelected || hasUserPaid} key={"tip"}>
      {isUserSelected ? tip : parseToCurrency(0)}
    </Cell>
    <Cell isDisabled={!isUserSelected || hasUserPaid} bold key={"total"}>
      {isUserSelected ? total : parseToCurrency(0)}
    </Cell>
    <Box flex={1} justifyContent={"center"} alignItems={"center"} >
      <Button
        isDisabled={!isUserSelected || hasUserPaid}
        isLoading={isLoading}
        w={"80%"}
        minW={"100"}
        maxW={"400"}
        fontSize={"2xl"}
        h={"80%"}
        colorScheme={"tertiary"}
        onPress={onPress}
      >
        {hasUserPaid ? t("paid") : t("pay")}
      </Button>
    </Box>
  </HStack >)
}
