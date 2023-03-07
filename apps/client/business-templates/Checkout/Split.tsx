import { formatAsPercentage, getPercentageOfValue, SplitType, splitTypes, typedKeys } from 'app-helpers'
import { HStack, Heading, Center, Divider, Pressable, Box, Input, Text, VStack, Button, Checkbox, Switch, Hidden } from 'native-base'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { FDSSelect } from '../../components/FDSSelect'
import { useGetTabCheckoutByIdQuery } from '../../gen/generated'
import { parseToCurrency } from 'app-helpers'
import { percentages, useCheckoutStore } from './checkoutStore'
import { texts } from './texts'
import { Checkout } from './types'
import { Transition } from '../../components/Transition'


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

const Header = ({ type, areAllUsersSelected, onCheckboxChange }: HeaderProps) => {
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
        {texts.patron}
      </Cell>
      <Cell bold>
        {texts.subtotal}
      </Cell>
      {type === "ByPatron" ? <Cell bold>
        {texts.sharedByTable}
      </Cell> : null}
      <Cell bold>
        {texts.feesAndTax}
      </Cell>
      <Cell bold>
        {texts.tip}
      </Cell>
      <Cell bold>
        {texts.total}
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
  ctaTitle: string;
  onPress: () => void;
}

const Row = ({
  type,
  subTotal,
  total,
  tip,
  sharedByTable,
  tax,
  user,
  isUserSelected,
  customSubTotal,
  ctaTitle,
  onPress,
  onCheckboxChange,
  onCustominputChange
}: RowProps) => {
  return (<HStack>
    <Box justifyContent={"center"}>
      <Checkbox
        isChecked={isUserSelected}
        colorScheme="green"
        value='user'
        onChange={onCheckboxChange}
      />
    </Box>
    <Cell isDisabled={!isUserSelected} key={"patron"}>
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
      <Cell isDisabled={!isUserSelected} key={"subtotal"}>{isUserSelected ? subTotal : parseToCurrency(0)}</Cell>}
    {type === "ByPatron" ?
      <Cell isDisabled={!isUserSelected} key={"shared-by-table"}>
        {isUserSelected ? sharedByTable : parseToCurrency(0)}
      </Cell> : null
    }
    <Cell isDisabled={!isUserSelected} key={"fees-and-taxes"}>
      {isUserSelected ? tax : parseToCurrency(0)}
    </Cell>
    <Cell isDisabled={!isUserSelected} key={"tip"}>
      {isUserSelected ? tip : parseToCurrency(0)}
    </Cell>
    <Cell isDisabled={!isUserSelected} bold key={"total"}>
      {isUserSelected ? total : parseToCurrency(0)}
    </Cell>
    <Box flex={1} justifyContent={"center"} alignItems={"center"} >
      <Button
        isDisabled={!isUserSelected}
        w={"80%"}
        minW={"100"}
        fontSize={"2xl"}
        h={"80%"}
        colorScheme={"tertiary"}
        onPress={onPress}
      >
        {ctaTitle}
      </Button>
    </Box>
  </HStack >)
}

export const Split = ({
  subTotal,
  tax,
}: Checkout) => {
  const { tip, discount, setSelectedTip, setSelectedDiscount, selectedDiscount, selectedTip, customTip, setCustomTip, setCustomDiscount, customDiscount, customSubTotals, setCustomSubTotal, clearCustomSubTotals } = useCheckoutStore(state => ({
    tip: state.tip,
    discount: state.discount,
    setSelectedTip: state.setSelectedTip,
    setSelectedDiscount: state.setSelectedDiscount,
    selectedTip: state.selectedTip,
    selectedDiscount: state.selectedDiscount,
    customTip: state.customTip,
    customDiscount: state.customDiscount,
    customSubTotals: state.customSubTotals,
    setCustomTip: state.setCustomTip,
    setCustomDiscount: state.setCustomDiscount,
    setCustomSubTotal: state.setCustomSubTotal,
    clearCustomSubTotals: state.clearCustomSubTotals,
  }))

  const [selectedOption, setSelectedOption] = useState<SplitType>("Custom");
  const [areAllUsersSelected, setAreAllUsersSelected] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});

  const route = useRouter()
  const { tabId } = route.query

  const { data } = useGetTabCheckoutByIdQuery({
    skip: !tabId,
    variables: {
      input: {
        _id: tabId as string
      }
    }
  })

  const allUsersFromTab = useMemo(() => data?.getTabByID?.users ?? [], [data?.getTabByID?.users])
  // we need more information to calculate the split
  const isSelectedTipCustom = selectedTip === "Custom"
  const isSelectedDiscountCustom = selectedDiscount === "Custom"
  const tipAmount = getPercentageOfValue(subTotal, tip)
  const discountAmount = getPercentageOfValue(subTotal, discount)
  const totalAmount = (subTotal ?? 0) - discountAmount + tipAmount
  const formatedTip = isSelectedTipCustom ? "Custom" : formatAsPercentage(tip)
  const formatedDiscount = isSelectedDiscountCustom ? "Custom" : formatAsPercentage(discount)
  const tipFieldValue = isSelectedTipCustom ? parseToCurrency(customTip) : parseToCurrency(tipAmount)
  const discountFieldValue = isSelectedDiscountCustom ? parseToCurrency(customDiscount) : parseToCurrency(discountAmount)

  // calculate the split, but we need to check if the user is selected
  // this should never be less than 1, we should always have at least one user
  const allSelectedUsers = typedKeys(selectedUsers).filter(key => selectedUsers[key])
  const totalNumberOfUsers = areAllUsersSelected ? allUsersFromTab.length ?? 0 : allSelectedUsers.length

  const subTotalAmountSharedEqually = (subTotal ?? 0) / totalNumberOfUsers

  const total = useMemo(() => {
    return parseToCurrency(totalAmount)
  }, [totalAmount])

  // memoize the split
  // recalculate split based on the selected users
  const split = useMemo(() => {
    return data?.getTabByID?.orders.reduce((acc, order) => {
      const subtotal = order?.subTotal ?? 0
      const isUserSelected = areAllUsersSelected || selectedUsers[order?.user ?? ""]

      // user is selected, should be included on their tab
      if (!order?.user || !isUserSelected) {
        return {
          ...acc,
          table: {
            subTotal: (acc?.table?.subTotal ?? 0) + subtotal
          }
        }
      }

      return ({
        ...acc,
        [order?.user]: {
          subTotal: (acc?.[order?.user]?.subTotal ?? 0) + subtotal
        }
      })
    }, {} as { [key: string]: { subTotal: number }, table: { subTotal: number } })
  }, [areAllUsersSelected, data?.getTabByID?.orders, selectedUsers])

  const [shareTip, setShareTip] = useState(true)

  const handleDiscountChange = (value: string) => {
    const text = value.replace(/[$,.]/g, '')
    const convertedValue = Number(text)
    if (Number.isInteger(convertedValue)) {
      setCustomDiscount(convertedValue, subTotal)
    }
  }

  const handleTipChange = (value: string) => {
    const text = value.replace(/[$,.]/g, '')
    const convertedValue = Number(text)
    if (Number.isInteger(convertedValue)) {
      setCustomTip(convertedValue, subTotal)
    }
  }

  const splitCustomBillComplete = useCallback(() => {
    let customTotal = 0;
    //todo: make this an object for faster lookup
    const customUsers: string[] = []; // keep track of which users have a custom subtotal
    for (const userId in customSubTotals) {
      if (customSubTotals[userId]) {
        customTotal += customSubTotals[userId];
        customUsers.push(userId);
      }
    }

    let remainingTotal = (subTotal ?? 0) - customTotal;
    const equalShare = remainingTotal / (totalNumberOfUsers - customUsers.length); // divide by the number of users without custom subtotals
    const finalTotals: Record<string, number> = {};
    for (const user of allUsersFromTab) {
      if (customSubTotals[user._id]) {
        finalTotals[user._id] = customSubTotals[user._id];
      } else if (remainingTotal <= 0 || customUsers.includes(user._id)) {
        finalTotals[user._id] = 0; // if there is no remaining total or the user has a custom subtotal, assign a subtotal of 0
      } else {
        finalTotals[user._id] = equalShare;
        remainingTotal -= equalShare; // subtract the equal share from the remaining total
      }
    }
    return finalTotals;
  }, [allUsersFromTab, customSubTotals, subTotal, totalNumberOfUsers])

  return (
    <Box flex={1}>
      <Center>
        <HStack justifyContent={"space-around"} w={"90%"} pb={4} space={2}>
          {typedKeys(splitTypes).map((type) => (
            <Pressable
              key={type}
              flex={1}
              justifyContent={"center"}
              onPress={() => setSelectedOption(type)}
            >
              <Heading
                textAlign={"center"}
                size={"md"}
                color={selectedOption === type ? "primary.500" : "gray.400"}
              >
                {splitTypes[type]}
              </Heading>
              <Divider mt={1} backgroundColor={selectedOption === type ? "primary.500" : "gray.400"} />
            </Pressable>
          ))}
        </HStack>
      </Center>
      <Box flex={1}>
        <Box flex={1}>
          <Header
            type={selectedOption}
            // if all users are selected, them this checkbox is enabled
            areAllUsersSelected={areAllUsersSelected || allSelectedUsers.length === allUsersFromTab.length}
            onCheckboxChange={(value) => {
              // se o value for negativo, zerar todos os checkboxes selecionados
              if (!value) {
                setSelectedUsers({})
                clearCustomSubTotals()
              }
              setAreAllUsersSelected(value)
            }}
          />
          {allUsersFromTab.map((user, index) => {
            const valueOfDiscountPerUser = getPercentageOfValue(split?.[user._id]?.subTotal, discount)
            const valueOfDiscount = getPercentageOfValue(split?.table.subTotal, discount)
            const tableSubTotal = (split?.table.subTotal ?? 0) - valueOfDiscount
            const totalPersonalAmount = (split?.[user._id]?.subTotal ?? 0) - valueOfDiscountPerUser

            const userSubTotal = selectedOption === "Equally" ?
              subTotalAmountSharedEqually : totalPersonalAmount

            const wSharedByTable = tableSubTotal / totalNumberOfUsers + userSubTotal

            const tipEqually = tipAmount / totalNumberOfUsers
            const userTip = selectedOption === "Equally" ?
              tipEqually :
              !shareTip ?
                getPercentageOfValue(wSharedByTable, tip)
                : tipEqually

            const total = userTip + userSubTotal + (selectedOption === "ByPatron" ?
              (tableSubTotal / totalNumberOfUsers) : 0)

            const finalCustomTotal = splitCustomBillComplete();

            return <Row
              ctaTitle={texts.pay}
              onPress={() => console.log({
                user: user._id,
                subTotal: userSubTotal,
                total: finalCustomTotal[user._id] ?? total,
                tip: userTip,
                discount: valueOfDiscountPerUser,
                splitType: selectedOption,
              })}
              onCheckboxChange={(value) => {
                setSelectedUsers({ ...selectedUsers, [user._id]: value })
                // if it's a false value, then we need to uncheck the all users checkbox
                if (!value) {
                  setAreAllUsersSelected(false)
                }
              }}
              isUserSelected={areAllUsersSelected || !!selectedUsers[user._id]} // if all is selected or if the object state has the user id set to true
              key={user._id}
              user={`Person ${(index + 1).toString()}`}
              type={selectedOption}
              subTotal={parseToCurrency(userSubTotal)}
              sharedByTable={parseToCurrency(wSharedByTable)}
              total={parseToCurrency(total)}
              tip={parseToCurrency(userTip)}
              tax={parseToCurrency((tax ?? 0) * total)}
              customSubTotal={parseToCurrency(finalCustomTotal[user._id])}
              onCustominputChange={(value) => {
                setCustomSubTotal(user._id, value)
              }}
            />
          })}
          <Transition isVisible={selectedOption !== "Equally"} >
            <HStack alignItems={"center"} space={"4"} pt={4}>
              <Switch size="md" onValueChange={setShareTip} colorScheme={"green"} isChecked={shareTip} />
              <Text fontSize={"lg"}>{"Share tip equally"}</Text>
            </HStack>
          </Transition>
        </Box>
        <VStack w={"50%"} minW={"lg"} pt={8} space={4}>
          <HStack justifyContent={"space-between"} px={8}>
            {selectedOption === "ByPatron" ? <>
              <Text fontSize={"lg"}>{texts.AllByTable}</Text>
              <Text fontSize={"lg"}>{parseToCurrency(split?.table.subTotal)}</Text>
            </> : null}
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.subtotal}</Text>
            <Text fontSize={"lg"}>{parseToCurrency(subTotal)}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.feesAndTax}</Text>
            <Text fontSize={"lg"}>{parseToCurrency((tax ?? 0) * (subTotal ?? 0))}</Text>
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.discount}</Text>
            <HStack space={2} alignItems={"self-end"}>
              <FDSSelect
                array={percentages}
                selectedValue={formatedDiscount}
                setSelectedValue={setSelectedDiscount}
              />
              <Input
                h={"6"}
                value={discountFieldValue}
                onChangeText={handleDiscountChange}
                w={100}
                isDisabled={!isSelectedDiscountCustom}
                textAlign={"right"} />
            </HStack>
          </HStack>
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"lg"}>{texts.tip}</Text>
            <HStack space={2}>
              <FDSSelect
                array={percentages}
                selectedValue={formatedTip}
                setSelectedValue={setSelectedTip}
              />
              <Input
                h={"6"}
                value={tipFieldValue}
                onChangeText={handleTipChange}
                w={100} isDisabled={!isSelectedTipCustom}
                textAlign={"right"}
              />
            </HStack>
          </HStack>
          <Divider marginY={2} />
          <HStack justifyContent={"space-between"} px={8}>
            <Text fontSize={"xl"} bold>{texts.total}</Text>
            <Text fontSize={"xl"} bold>{total}</Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}