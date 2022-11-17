import { Box, HStack, VStack } from "native-base"
import React from "react"

export const DashboardScreen = () => {
  return (
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
          h={"300px"}
          w={"100%"}
          borderRadius={"md"}
          bgColor={"white"}>
        </Box>

        <HStack space={3} h={"100%"} w={"100%"} flex={1} flexDirection={"row"}>
          <Box borderWidth={0.5} borderColor={"gray.50"} shadow={"2"} flex={1} borderRadius={"md"} bgColor={"white"}></Box>
          <Box borderWidth={0.5} borderColor={"gray.50"} shadow={"2"} flex={1} borderRadius={"md"} bgColor={"white"}></Box>
        </HStack>

      </VStack>
    </Box >
  )

}