import { formatAsPercentage, SplitType, splitTypes, typedKeys } from 'app-helpers'
import { HStack, Heading, Center, Divider, Pressable, Box, Input, Text, VStack, Button, Checkbox, Hidden, Select, CheckIcon } from 'native-base'
import { useRouter } from 'next/router'
import React, { FC, useMemo, useState } from 'react'
import { FDSSelect } from '../../components/FDSSelect'
import { useGetTabCheckoutByIdQuery } from '../../gen/generated'
import { parseToCurrency } from '../../utils'
import { percentages, useCheckoutStore } from './checkoutStore'
import { texts } from './texts'
import { Checkout } from './types'


const Cell: FC<{ bold?: boolean }> = ({ children, bold }) => {
  return (
    <Text
      w={100}
      alignSelf={"center"}
      textAlign={"center"}
      fontSize={"lg"}
      bold={bold}
    >
      {children}
    </Text>
  )
}

const Header = ({ type }: { type: SplitType }) => {
  return (
    <HStack py={2}>
      <Box justifyContent={"center"}>
        <Checkbox colorScheme="green" value='user' onChange={value => console.log()} />
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
}

const Row = ({
  type,
  subTotal,
  total,
  tip,
  sharedByTable,
  tax,
  user
}: RowProps) => {
  return (<HStack>
    <Box justifyContent={"center"}>
      <Checkbox colorScheme="green" value='user' onChange={value => console.log()} />
    </Box>
    <Cell key={"patron"}>
      {user}
    </Cell >
    {type === "Custom" ?
      <Input textAlign={"center"} h={"6"} value='$100' w={140} /> :
      <Cell key={"subtotal"}>{subTotal}</Cell>}
    {type === "ByPatron" ?
      <Cell key={"shared-by-table"}>
        {sharedByTable}
      </Cell> : null
    }
    <Cell key={"fees-and-taxes"}>
      {tax}
    </Cell>
    <Cell key={"tip"}>
      {tip}
    </Cell>
    <Cell bold key={"total"}>
      {total}
    </Cell>
    <Box flex={1} justifyContent={"center"} alignItems={"center"} >
      <Button w={"80%"} minW={"100"} fontSize={"2xl"} h={"80%"} colorScheme={"tertiary"}>
        Pay
      </Button>
    </Box>
  </HStack >)
}

export const Split = ({
  subTotal,
  totalPaid,
  // total,
  tax,
  // tip,
}: Checkout) => {
  const { tip, discount, setSelectedTip, setSelectedDiscount, selectedDiscount, selectedTip, customTip, setCustomTip, setCustomDiscount } = useCheckoutStore(state => ({
    tip: state.tip,
    discount: state.discount,
    setSelectedTip: state.setSelectedTip,
    setSelectedDiscount: state.setSelectedDiscount,
    selectedTip: state.selectedTip,
    selectedDiscount: state.selectedDiscount,
    customTip: state.customTip,
    setCustomTip: state.setCustomTip,
    setCustomDiscount: state.setCustomDiscount,
  }))

  const [selectedOption, setSelectedOption] = useState<SplitType>("ByPatron")
  const route = useRouter()
  const { tabId } = route.query


  console.log("subtotal", subTotal)
  console.log("tip", tip)
  console.log("total tip", tip * (subTotal ?? 0))

  const { data } = useGetTabCheckoutByIdQuery({
    skip: !tabId,
    variables: {
      input: {
        _id: tabId as string
      }
    }
  })
  // we need more information to calculate the split
  const formatedTip = selectedTip === "Custom" ? "Custom" : formatAsPercentage(tip)
  const formatedDiscount = selectedDiscount === "Custom" ? "Custom" : formatAsPercentage(discount)
  const tipFieldValue = selectedTip === "Custom" ? parseToCurrency(customTip) : parseToCurrency(tip * (subTotal ?? 0))
  const total = useMemo(() => {
    const discountAmount = (discount * (subTotal ?? 0))
    const tipAmount = (tip * (subTotal ?? 0))
    return parseToCurrency((subTotal ?? 0) - discountAmount + tipAmount)
  }, [subTotal, tip, discount])

  const split = data?.getTabByID?.orders.reduce((acc, order) => {
    const subtotal = order?.subTotal ?? 0

    if (!order?.user) {
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

  console.log({ tipFieldValue })

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
        <Box flex={1} >
          <Header type={selectedOption} />
          {data?.getTabByID?.users?.map((user, index) => {
            const userSubTotal = split?.[user._id]?.subTotal ?? 0
            const tableSubTotal = split?.table.subTotal ?? 0
            const sharedByTable = tableSubTotal / (data?.getTabByID?.users?.length ?? 1)
            const userTip = true ? tip * (userSubTotal + sharedByTable) : 0
            const total = userTip + userSubTotal + (tableSubTotal / (data?.getTabByID?.users?.length ?? 1))

            return <Row
              key={user._id}
              user={`Person ${(index + 1).toString()}`}
              type={selectedOption}
              subTotal={parseToCurrency(userSubTotal)}
              sharedByTable={parseToCurrency(sharedByTable)}
              total={parseToCurrency(total)}
              tip={parseToCurrency(userTip)}
              tax={parseToCurrency((tax ?? 0) * total)}
            />
          }
          )}
        </Box>
        <VStack w={"50%"} minW={"lg"} pt={8} space={4}>
          <HStack justifyContent={"space-between"} px={8}>
            {selectedOption === "ByPatron" ? <>
              <Text fontSize={"lg"}>{texts.AllByTable}</Text>
              <Text fontSize={"lg"}>{parseToCurrency(split?.table.subTotal)}</Text>
            </> : <>
              <Text fontSize={"lg"}>{texts.splitBy}</Text>
              <Input value='4' w={100} h={"6"} textAlign={"right"} />
            </>}
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
              <Input h={"6"} value='$0.00' w={100} isDisabled={true} textAlign={"right"} />
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
              <Input h={"6"} value={tipFieldValue} w={100} isDisabled={true} textAlign={"right"} />
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