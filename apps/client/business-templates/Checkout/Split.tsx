import { getPercentageOfValue, SplitType, splitTypes, typedKeys } from 'app-helpers'
import { HStack, Heading, Center, Divider, Pressable, Box, Input, Text, VStack, Switch, Button, ScrollView } from 'native-base'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FDSSelect } from '../../components/FDSSelect'
import { GetCheckoutByIdDocument, useGetTabCheckoutByIdQuery, useMakeCheckoutPaymentMutation, SplitType as SplitTypeGen, useCustomerRequestSplitMutation } from '../../gen/generated'
import { parseToCurrency } from 'app-helpers'
import { percentageSelectData, useCheckoutStore, useComputedChekoutStore } from './checkoutStore'
import { Transition } from '../../components/Transition'
import { Header, Row } from './TableComponents'
import { useTranslation } from 'next-i18next'
import { SummaryRow } from './Checkout'
import { showToast } from '../../components/showToast'

type SplitProps = {
  subTotal?: number
  tax?: number
  payments: ({
    __typename?: "Payment" | undefined;
    amount: number;
    _id: string;
    splitType?: SplitType | null | undefined;
    patron: string;
    tip: number;
    discount?: number | null | undefined;
  } | null)[] | undefined
}

export const Split = ({
  subTotal,
  tax,
  payments
}: SplitProps) => {
  const { total, tip, discount, setSelectedTip, setSelectedDiscount, selectedDiscount, selectedTip, customTip, setCustomTip, setSelectedSplitType, selectedSplitType, customDiscount, customSubTotals, setCustomSubTotal, clearCustomSubTotals, setCustomDiscount, selectedUsers, setSelectedUsers } = useCheckoutStore(state => ({
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
    total: state.total,
    setSelectedSplitType: state.setSelectedSplitType,
    selectedSplitType: state.selectedSplitType,
    setSelectedUsers: state.setSelectedUsers,
    selectedUsers: state.selectedUsers,
  }))

  const {
    absoluteTotal,
    tipCalculation,
    discountCalculation,
  } = useComputedChekoutStore()

  const [shareTip, setShareTip] = useState(true)
  const [areAllUsersSelected, setAreAllUsersSelected] = useState(true);

  const { t } = useTranslation("businessCheckout")

  const route = useRouter()
  const { tabId, checkoutId } = route.query

  const [requestSplit, { loading: loadingSplit }] = useCustomerRequestSplitMutation({
    onError: (error) => {
      showToast({
        status: "error",
        message: error.message,
      })
    },
    refetchQueries: [
      {
        query: GetCheckoutByIdDocument,
        variables: {
          input: {
            _id: checkoutId as string
          }
        }
      }
    ]
  })

  const { data: tabData } = useGetTabCheckoutByIdQuery({
    skip: !tabId,
    variables: {
      input: {
        _id: tabId as string
      }
    },
    onCompleted: (data) => {
      setSelectedUsers({
        ...tabData?.getTabByID?.users?.reduce((acc, user) => {
          acc[user._id] = true
          return acc
        }, {} as { [key: string]: boolean }),
        ...selectedUsers,
      })
    }
  })

  // we will get information from the payments through the checkout
  // we need to get the users from the payments

  // make an object with the users and the payments for fast lookup
  const paymentsByUser = payments?.reduce((acc, payment) => {
    const { patron, amount, splitType, tip, discount } = payment || {}

    acc.totalPaid = (acc.totalPaid ?? 0) + (amount ?? 0)

    if (!patron) {
      return acc
    }

    return {
      ...acc,
      [patron]: {
        amount: (acc?.[patron]?.amount ?? 0) + (amount ?? 0),
        splitType,
        tip: (acc?.[patron]?.tip ?? 0) + (tip ?? 0),
        discount: (acc?.[patron]?.discount ?? 0) + (discount ?? 0),
      }
    }
  }, {} as { [key: string]: { amount: number, splitType?: SplitType | null, tip: number, discount: number } } & {
    totalPaid: number
  })

  const allUsersFromTab = useMemo(() => tabData?.getTabByID?.users ?? [], [tabData?.getTabByID?.users])

  // calculate the split, but we need to check if the user is selected
  // this should never be less than 1, we should always have at least one user
  const allSelectedUsers = typedKeys(selectedUsers).filter(key => selectedUsers[key])
  const totalNumberOfUsers = areAllUsersSelected ? allUsersFromTab.length ?? 0 : allSelectedUsers.length

  const subTotalAmountSharedEqually = (subTotal ?? 0) / totalNumberOfUsers

  // memoize the split
  // recalculate split based on the selected users
  const split = useMemo(() => {
    return tabData?.getTabByID?.orders.reduce((acc, order) => {
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
  }, [areAllUsersSelected, tabData?.getTabByID?.orders, selectedUsers])

  const splitCustomBillComplete = useCallback(() => {
    let customTotal = 0;
    //TODO: make this an object for faster lookup
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
      <VStack w={"full"} minW={"lg"} space={4}>
        {selectedSplitType === "ByPatron" ?
          <SummaryRow label={t("AllByTable")} value={parseToCurrency(total)} /> : null}
        <SummaryRow label={t("subtotal")} value={parseToCurrency(subTotal)} />
        <SummaryRow label={t("feesAndTax")} value={parseToCurrency((tax ?? 0) * (subTotal ?? 0))} />

        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"xl"}>{t("discount")}</Text>
          <HStack space={2} alignItems={"self-end"}>
            <FDSSelect
              w={100} h={10}
              array={percentageSelectData}
              selectedValue={selectedDiscount}
              //@ts-ignore
              setSelectedValue={setSelectedDiscount}
            />
            {selectedDiscount === "Custom" ?
              <Input
                w={100} h={10}
                fontSize={"lg"}
                textAlign={"right"}
                value={(customDiscount / 100)
                  .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                onChangeText={(value) => {
                  const text = value.replace(/[$,.]/g, '');
                  const convertedValue = Number(text);

                  if (isNaN(convertedValue)) return

                  return setCustomDiscount(convertedValue)
                }}
              />
              :
              <Text
                textAlign={"right"}
                alignSelf={"center"}
                w={100} fontSize={"lg"}>
                {parseToCurrency(discountCalculation)}
              </Text>}
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} px={12}>
          <Text fontSize={"xl"}>{t("tip")}</Text>
          <HStack space={2}>
            <FDSSelect
              w={100} h={10}
              array={percentageSelectData}
              selectedValue={selectedTip}
              //@ts-ignore
              setSelectedValue={setSelectedTip}
            />
            {selectedTip === "Custom" ?
              <Input
                w={100} h={10}
                fontSize={"lg"}
                textAlign={"right"}
                value={(customTip / 100)
                  .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                onChangeText={(value) => {
                  const text = value.replace(/[$,.]/g, '');
                  const convertedValue = Number(text);

                  if (isNaN(convertedValue)) return

                  return setCustomTip(convertedValue)
                }}
              /> :
              <Text
                textAlign={"right"}
                alignSelf={"center"}
                w={100} fontSize={"lg"}>
                {parseToCurrency(tipCalculation)}
              </Text>}
          </HStack>
        </HStack>
        <Divider marginY={2} />
        <SummaryRow label={t("total")} value={parseToCurrency(absoluteTotal)} />
      </VStack>
      <Center pt={2}>
        <HStack justifyContent={"space-around"} w={"90%"} pb={4} space={2}>
          {typedKeys(splitTypes).reduce((acc, splitType) => {
            if (splitType !== "Full") {
              return [...acc, (
                <Pressable
                  key={splitType}
                  flex={1}
                  justifyContent={"center"}
                  onPress={() => setSelectedSplitType(splitType)}
                >
                  <Heading
                    textAlign={"center"}
                    size={"md"}
                    color={selectedSplitType === splitType ? "primary.500" : "gray.400"}
                  >
                    {t(splitType)}
                  </Heading>
                  <Divider mt={1} backgroundColor={selectedSplitType === splitType ? "primary.500" : "gray.400"} />
                </Pressable>
              )]
            }
            return acc

          }, [] as (Element | JSX.Element)[])}
        </HStack>
      </Center>
      <ScrollView flex={1} w={"full"} showsHorizontalScrollIndicator>
        <Center flex={1}>
          <Header
            type={selectedSplitType}
            // if all users are selected, them this checkbox is enabled
            areAllUsersSelected={allSelectedUsers.length === allUsersFromTab.length}
            onCheckboxChange={(value) => {
              console.log("value", value)
              // se o value for negativo, zerar todos os checkboxes selecionados
              if (!value) {
                setSelectedUsers({})
                clearCustomSubTotals()
              }

              // TODO: set all users as selected
              // remove this state
              setAreAllUsersSelected(value)
            }}
          />
          {allUsersFromTab.map((user, index) => {
            if (selectedSplitType === "Full") return null

            const valueOfDiscountPerUser = getPercentageOfValue(split?.[user._id]?.subTotal ?? 0, discount)
            const valueOfDiscount = getPercentageOfValue(split?.table?.subTotal ?? 0, discount)
            const tableSubTotal = (split?.table?.subTotal ?? 0) - valueOfDiscount
            const totalPersonalAmount = (split?.[user._id]?.subTotal ?? 0) - valueOfDiscountPerUser

            const userSubTotal = selectedSplitType === "Equally" ?
              subTotalAmountSharedEqually : totalPersonalAmount

            const wSharedByTable = tableSubTotal / totalNumberOfUsers + userSubTotal

            const tipEqually = tipCalculation / totalNumberOfUsers
            const userTip = selectedSplitType === "Equally" ?
              tipEqually :
              !shareTip ?
                getPercentageOfValue(wSharedByTable, tip)
                : tipEqually

            const total = userTip + userSubTotal + (selectedSplitType === "ByPatron" ?
              (tableSubTotal / totalNumberOfUsers) : 0)

            const finalCustomTotal = splitCustomBillComplete();

            return <Row
              onCheckboxChange={(value) => {
                setSelectedUsers({ ...selectedUsers, [user._id]: value })
                // if it's a false value, then we need to uncheck the all users checkbox
                if (!value) {
                  setAreAllUsersSelected(false)
                }
              }}
              hasUserPaid={!!paymentsByUser?.[user._id]}
              isUserSelected={!!selectedUsers[user._id]} // if all is selected or if the object state has the user id set to true
              key={user._id}
              user={`Person ${(index + 1).toString()}`}
              type={selectedSplitType}
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
          <Transition isVisible={selectedSplitType !== "Equally"}>
            <HStack alignItems={"center"} space={"4"} pt={4}>
              <Switch size="md" onValueChange={setShareTip} colorScheme={"green"} isChecked={shareTip} />
              <Text fontSize={"lg"}>{"Share tip equally"}</Text>
            </HStack>
          </Transition>

        </Center>
      </ScrollView>
      <Box alignItems={"center"} px={'24'} py={4} w={"full"}>
        <Button w={"full"} colorScheme={"tertiary"}
          onPress={() => {

            // same call made by client
            console.log("Requesting split")
            console.log({
              checkout: checkoutId as string,
              splitType: selectedSplitType,
              tip,
              selectedUsers,
              customSubTotals
            })

            let customSplit: { patron: string; amount: number }[] = [];

            if (selectedSplitType === "Custom") {
              customSplit = typedKeys(selectedUsers).reduce((acc, curr) => {

                if (selectedUsers[curr] && customSubTotals[curr]) {
                  acc.push({
                    patron: curr.toString(),
                    amount: customSubTotals[curr]
                  })

                  return acc
                }

                return acc
              }, [] as { patron: string, amount: number }[])
            }

            requestSplit({
              variables: {
                input: {
                  checkout: checkoutId as string,
                  splitType: SplitTypeGen[selectedSplitType],
                  tip,
                  selectedUsers: typedKeys(selectedUsers).filter((key) => !!selectedUsers[key]) as string[],
                  customSplit
                }
              }
            })
          }}>
          {t("splitNow")}
        </Button>
      </Box>
    </Box>
  )
}