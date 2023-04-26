import { typedKeys, splitTypes, parseToCurrency } from 'app-helpers'
import { HStack, Checkbox, Text, Box, Divider, Radio, Badge, VStack } from 'native-base'
import React from 'react'
import { useCheckoutStore, useComputedChekoutStore } from '../../business-templates/Checkout/checkoutStore'
import { shallow } from 'zustand/shallow'
import { useGetClientSession } from '../../hooks'
import { useGetOrdersBySessionQuery } from '../../gen/generated'
import { texts } from './texts'

export const Split = () => {
  const { selectedSplitType, setSelectedSplitType, setSelectedUsers, selectedUsers, setSplitByPatron } = useCheckoutStore(state => ({
    setSelectedSplitType: state.setSelectedSplitType,
    selectedSplitType: state.selectedSplitType,
    setSelectedUsers: state.setSelectedUsers,
    selectedUsers: state.selectedUsers,
    setSplitByPatron: state.setSplitByPatron
  }),
    shallow
  )

  const {
    splitEqually,
    computedSplitByPatron,
    amountPerUser,
  } = useComputedChekoutStore()

  const { data: clientSession } = useGetClientSession()
  const { data } = useGetOrdersBySessionQuery({
    onCompleted(data) {
      if (!data.getOrdersBySession) return
      setSplitByPatron(data.getOrdersBySession)
    },
  })

  return (
    <Box>
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
      {selectedSplitType === "ByPatron" ? <HStack pt={4} px={4} justifyContent={"space-between"}>
        <Text fontSize={"lg"} bold>
          {texts.tabShared}
        </Text>
        <Text fontSize={"lg"} bold>
          {parseToCurrency(computedSplitByPatron.tab.subTotal)}
        </Text>
      </HStack> : null}
      {clientSession?.getClientSession.tab?.users?.map((user, i) => (
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
            <HStack flex={1} justifyContent={"flex-end"} space={1} alignItems={"center"}>
              {selectedUsers[user?._id] && selectedSplitType === "ByPatron" && amountPerUser ? <Badge
                rounded="full"
                colorScheme="success"
                variant={"outline"}
                color={"success.500"}
                h={"4"}
              >
                {"+" + parseToCurrency(amountPerUser)}
              </Badge> : null}
              <Text fontSize={"lg"}>
                {parseToCurrency(selectedUsers[user?._id] ? selectedSplitType === "ByPatron" ? computedSplitByPatron[user?._id]?.subTotal : splitEqually : 0)}
              </Text>
            </HStack>
          </HStack>
      ))}
    </Box>
  )
}
