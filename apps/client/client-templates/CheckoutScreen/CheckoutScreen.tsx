import { Box, Button, Divider, Heading, HStack, Text, VStack } from 'native-base'
import React, { useState } from 'react'
import { FDSSelect } from '../../components/FDSSelect'
import { FDSTab, TabsType } from '../../components/FDSTab'
import { PayTable } from './PayTable'
import { Split } from './Split'

const tabs: TabsType = {
  payTable: "Pay Table",
  split: "Split Payment",
}

export const CheckoutScreen = () => {
  const [selectedTab, setSelectedTab] = useState("payTable");

  const pay = () => {
    console.log("pay")
  }

  return (
    <Box p={4}>
      <FDSTab
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "split" && <Split />}
      <PayTable />
      <Box justifyContent={"flex-end"} mt={4}>
        <VStack space={"4"} p={4}>
          <Button
            _text={{ bold: true }}
            flex={1}
            colorScheme={"primary"}
            onPress={pay}>{"Pay"}</Button>
          <Button
            _text={{ bold: true }}
            flex={1}
            colorScheme={"success"}
            onPress={pay}>{"See Check"}</Button>
        </VStack>
      </Box>
    </Box>
  )
}
