import React from "react"
import { Box, HStack, Heading, ScrollView, Text, VStack } from "native-base"
import { AreaChart } from "./Graphs/AreaChart"
import { PieChart } from "./Graphs/PieChart"
import { VerticalBar } from "./Graphs/VerticalBar"
import { OrangeBox } from "../../components/OrangeBox"

export const DashboardScreen = () => {
  return (
    <Box flex={1} shadow={"2"} backgroundColor={"gray.100"}>
      <OrangeBox />
      <VStack space={4} p={4} flex={1}>
        <Panel />
        <HStack space={3} flex={1}>
          <ScrollView pr={2} pb={2} borderRadius={"md"}>
            <VStack space={8} flex={1}>
              <AreaChart />
              <VerticalBar />
            </VStack>
          </ScrollView>
          <PieChart />
        </HStack>
      </VStack>
    </Box>
  )
}

const Panel = () => (
  <VStack p={4} space={2} borderWidth={1}
    borderColor={"gray.50"}
    shadow={"2"}
    borderRadius={"md"}
    bgColor={"white"}
  >
    <Heading size="md">Ola, Customer Fasto</Heading>
    <Heading size="xs">(Seja Bem vindo)</Heading>
    <Text>Work in Progress</Text>
  </VStack>
)