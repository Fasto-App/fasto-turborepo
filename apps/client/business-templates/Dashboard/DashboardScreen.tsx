import React from "react"
import { Box, HStack, Heading, ScrollView, VStack } from "native-base"
import { AreaChart } from "./Ghaphs/AreaChart"
import { PieChart } from "./Ghaphs/PieChart"
import { VerticalBar } from "./Ghaphs/VerticalBar"
import { OrangeBox } from "../../components/OrangeBox"

export const DashboardScreen = () => {
  return (
    <Box flex={1}>
      <OrangeBox height={150} />
      <VStack space={4} p={8} flex={1}>
        <Panel />
        <HStack space={3} flex={1}>
          <ScrollView pr={2} pb={2} borderRadius={"md"}>
            <VStack space={3} flex={1}>
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
  </VStack>
)