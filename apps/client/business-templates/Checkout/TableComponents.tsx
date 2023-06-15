import React from "react"
import { SplitType, parseToCurrency } from "app-helpers";
import { HStack, Box, Checkbox, Input, Text, Button } from "native-base";
import { FC } from "react";
import { useTranslation } from "next-i18next";

const Cell: FC<{ bold?: boolean, isDisabled?: boolean }> = ({ children, bold, isDisabled }) => {
  return (
    <Text
      w={150}
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

const PaymentCell: FC<{ bold?: boolean, isDisabled?: boolean }> = ({ children, bold, isDisabled }) => {

  return (
    <Text
      w={150}
      textAlign={"right"}
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
  onCheckboxChange,
  onCustominputChange,
  hasUserPaid
}: RowProps) => {
  const { t } = useTranslation("businessCheckout")

  return (<HStack h={"10"}>
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
        h={"8"}
        isDisabled={!isUserSelected || hasUserPaid}
        variant="underlined"
        fontSize={"lg"}
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
  </HStack >)
}

export const PaymentTile = (props: {
  customer: string;
  subtotal: string;
  tip: string;
  cta: string;
  onPress: () => void;
  loading?: boolean;
  disable?: boolean;
}) => {
  const { customer,
    subtotal,
    tip,
    cta,
    onPress,
    loading,
    disable
  } = props
  return (
    <HStack justifyContent={"space-between"} w={"100%"} py={1} opacity={disable ? 0.5 : 1}>
      <PaymentCell>{customer}</PaymentCell>
      <PaymentCell>{subtotal}</PaymentCell>
      <PaymentCell>{tip}</PaymentCell>
      <Button
        w={"40"}
        h={"10"}
        colorScheme={"tertiary"}
        onPress={onPress}
        isLoading={loading}
        isDisabled={disable}
      >
        {cta}
      </Button>
    </HStack>
  )
}
