import { Box, Button, Divider, Heading, HStack, Text, VStack } from 'native-base'
import React from 'react'
import { FDSTab, TabsType } from '../../components/FDSTab'

const tabs: TabsType = {
  payTable: "Pay Table",
  split: "Split",
}

export const CheckoutScreen = () => {
  const [selectedTab, setSelectedTab] = React.useState("payTable");

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
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Subtotal"}</Text>
        <Text fontSize={"lg"}>{"$19.00"}</Text>
      </HStack>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Taxes"}</Text>
        <Text fontSize={"lg"}>{"$19.00"}</Text>
      </HStack>
      <HStack justifyContent={"space-between"} pt={4} px={4}>
        <Text fontSize={"lg"}>{"Tip"}</Text>
        <Text fontSize={"lg"}>{"$19.00"}</Text>
      </HStack>
      <Divider marginY={2} />
      <HStack justifyContent={"space-between"} pt={2} px={4}>
        <Text fontSize={"xl"} bold>{"total"}</Text>
        <Text fontSize={"xl"} bold>{"$19.00"}</Text>
      </HStack>
      <Box h={"100%"} justifyContent={"flex-end"}>

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
