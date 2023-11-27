import React from "react"
import { Box, HStack, Heading, ScrollView, Text, VStack } from "native-base"
import { AreaChart } from "./Graphs/AreaChart"
import { PieChart } from "./Graphs/PieChart"
import { VerticalBar } from "./Graphs/VerticalBar"
import { OrangeBox } from "../../components/OrangeBox"
import { useTranslation } from "next-i18next"

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

const Panel = () => {
  const { t } = useTranslation("businessDashboard")


  return (
    <VStack p={4} space={2} borderWidth={1}
      borderColor={"gray.50"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
    >
      <Heading size="md">{t('hello')}</Heading>
      <Heading size="xs">{t('welcomeDashBoard')}</Heading>

      <HStack space={"3"}>

        <Box
          p={"3"}
          borderRadius={"md"}
          borderColor={"coolGray.200"}
          borderWidth={1}
          w={"48"}
        >
          <Text fontSize={"md"}>
            {`Total Revenue`}
          </Text>
          <Text fontSize={"md"} bold>
            $45,231.89
          </Text>
        </Box>

        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>
            {`Most Selling Item`}
          </Text>
          <Text fontSize={"md"} bold>
            {"Burbon"}
          </Text>
        </Box>
        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>
            {`Number of Orders`}
          </Text>
          <Text fontSize={"md"} bold>
            +132
          </Text>
        </Box>
      </HStack>
    </VStack>
  )
}