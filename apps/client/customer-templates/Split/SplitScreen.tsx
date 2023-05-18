import { typedKeys, splitTypes, parseToCurrency } from 'app-helpers'
import { HStack, Checkbox, Text, Box, Divider, Radio, Badge, VStack, Input, Button, Skeleton, ScrollView } from 'native-base'
import React, { useEffect } from 'react'
import { useCheckoutStore, useComputedChekoutStore } from '../../business-templates/Checkout/checkoutStore'
import { shallow } from 'zustand/shallow'
import { useGetClientSession } from '../../hooks'
import { useGetOrdersBySessionQuery } from '../../gen/generated'
import { useTranslation } from 'next-i18next'
import { OrderTotals } from '../CheckoutScreen'

export const SplitScreen = () => {
  const { selectedSplitType, setSelectedSplitType, setSelectedUsers, selectedUsers, setSplitByPatron, customSubTotals, setCustomInputOnChange } = useCheckoutStore(state => ({
    setSelectedSplitType: state.setSelectedSplitType,
    selectedSplitType: state.selectedSplitType,
    setSelectedUsers: state.setSelectedUsers,
    selectedUsers: state.selectedUsers,
    setSplitByPatron: state.setSplitByPatron,
    customSubTotals: state.customSubTotals,
    setCustomSubTotal: state.setCustomSubTotal,
    setCustomInputOnChange: state.setCustomInputOnChange,
  }),
    shallow
  )

  const {
    splitEqually,
    computedSplitByPatron,
    amountPerUser,
    customTotalRemaing,
  } = useComputedChekoutStore()

  const { t } = useTranslation("customerCheckout")

  const { data: clientSession, loading, error } = useGetClientSession()
  useGetOrdersBySessionQuery({
    onCompleted(data) {
      if (!data.getOrdersBySession) return
      setSplitByPatron(data.getOrdersBySession)
    },
  })

  useEffect(() => {
    setSelectedUsers({
      ...selectedUsers,
      ...clientSession?.getClientSession?.tab?.users?.reduce((acc, user) => {
        acc[user._id] = true
        return acc
      }, {} as { [key: string]: boolean })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ScrollView flex={1}>
        <Radio.Group name="myRadioGroup"
          accessibilityLabel="favorite number"
          // @ts-ignore
          onChange={setSelectedSplitType}
          value={selectedSplitType}
          direction={"row"}
          display={"flex"}
        >
          <HStack space={4} py={2} width={"100%"}
            justifyContent={"center"}
          >
            {typedKeys(splitTypes).map((splitType) => {
              return (
                <Radio key={splitType} value={splitType}>
                  {splitType}
                </Radio>
              )
            })}
          </HStack>
        </Radio.Group>
        {selectedSplitType === "ByPatron" ?
          <HStack pt={4} px={4} justifyContent={"space-between"}>
            <Text fontSize={"lg"} bold>
              {t("tabShared")}
            </Text>
            <Text fontSize={"lg"} bold>
              {parseToCurrency(computedSplitByPatron.tab.subTotal)}
            </Text>
          </HStack> : selectedSplitType === "Custom" ?
            <HStack pt={4} px={4} justifyContent={"space-between"}>
              <Text fontSize={"lg"} bold>
                {t("totalRemaining")}
              </Text>
              <Text fontSize={"lg"} bold>
                {parseToCurrency(customTotalRemaing)}
              </Text>
            </HStack> : null}

        {loading ? <LoadingSplitScreen /> :
          clientSession?.getClientSession.tab?.users?.map((user, i) => {
            return (
              !user._id ? null :
                <HStack key={i} pt={4} px={4} justifyContent={"space-between"}>
                  <Checkbox
                    maxW={180}
                    value={user?._id}
                    isChecked={selectedUsers[user?._id]}
                    onChange={() =>
                      setSelectedUsers({
                        ...selectedUsers,
                        [user?._id]: !selectedUsers[user?._id]
                      })
                    }
                  >
                    {user?.name}
                  </Checkbox>
                  {!selectedUsers[user?._id] ?
                    <Text fontSize={"lg"}>{parseToCurrency(0)}</Text> :
                    selectedSplitType === "Custom" ?
                      <Input
                        w={120} h={8}
                        fontSize={"lg"}
                        textAlign={"right"}
                        value={(Number(customSubTotals[user?._id] ? customSubTotals[user?._id] : 0) / 100)
                          .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        onChangeText={(value) => {
                          setCustomInputOnChange(user?._id, value)
                        }}
                      />
                      :
                      <HStack flex={1} justifyContent={"flex-end"} space={1} alignItems={"center"}>
                        {selectedSplitType === "ByPatron" && amountPerUser ? <Badge
                          rounded="full"
                          colorScheme="success"
                          variant={"outline"}
                          color={"success.500"}
                          h={"4"}
                        >
                          {"+" + parseToCurrency(amountPerUser)}
                        </Badge> : null}
                        <Text fontSize={"lg"}>
                          {parseToCurrency(selectedSplitType === "ByPatron" ?
                            computedSplitByPatron[user?._id]?.subTotal : splitEqually)}
                        </Text>
                      </HStack>}
                </HStack>
            )
          })}
      </ScrollView>

      <Box py={4} px={2} >
        <OrderTotals />
        <Button mt={4}>
          {t("split")}
        </Button>
      </Box>
    </>
  )
}

const LoadingSplitScreen = () => {

  return (
    <>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <HStack
          key={i}
          py={2}
          px='4'
          alignItems={"center"}
        >
          <HStack flex={1} alignItems={"center"} space={4}>
            <Skeleton size="6" rounded="md" />
            <Skeleton maxW={"48"} h="5" rounded="full" />
          </HStack>
          <Box w={20}>
            <Skeleton h="5" rounded="full" />
          </Box>
        </HStack>
      ))}
    </>)
}
