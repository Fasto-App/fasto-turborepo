import { Box, HStack, VStack } from "native-base"
import React from "react"
import { useIsSsr } from "../../hooks"
import { AreaChart } from "./Ghaphs/AreaChart"
import { PieChart } from "./Ghaphs/PieChart"
import { VerticalBar } from "./Ghaphs/VerticalBar"

export const DashboardScreen = () => {


  return useIsSsr() ? null : (
    <Box flex={1}>

      <Box
        backgroundColor={"primary.500"}
        h={150}
        w={"100%"}
        position={"absolute"}
        zIndex={-1}
      />

      <VStack space={3} p={"8"} flex={1}>
        <Box
          borderWidth={0.5}
          borderColor={"gray.50"}
          shadow={"2"}
          w={"100%"}
          borderRadius={"md"}
          bgColor={"white"}
          justifyContent={"center"}
        >
          <AreaChart />
        </Box>

        <HStack space={3} w={"100%"} flexDirection={"row"} flex={1}>
          <Box borderWidth={0.5}
            borderColor={"gray.50"}
            shadow={"2"}
            borderRadius={"md"}
            bgColor={"white"}
            p={2}
            flex={1}
          >
            <VerticalBar />
          </Box>
          <Box borderWidth={0.5}
            borderColor={"gray.50"}
            shadow={"2"}
            borderRadius={"md"}
            bgColor={"white"}
          >
            <PieChart />
          </Box>
        </HStack>

      </VStack>
    </Box >
  )

}