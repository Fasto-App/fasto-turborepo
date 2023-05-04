import { Box, Skeleton, HStack } from 'native-base'
import React from 'react'

export const LoadingPDP = () => {
  return (
    <Box flex={1} px={4}>
      <Skeleton h={"200"} rounded="md" startColor="secondary.100" />
      <Box h={8} />
      <Skeleton maxW={"48"} h="6" rounded="full" startColor="gray.300" />
      <Box h={6} />
      <Skeleton.Text />
      <HStack space={4} py={6}>
        <Skeleton size="8" rounded="md" />
        <Skeleton w={3} h={8} rounded="xl" />
        <Skeleton size="8" rounded="md" />
      </HStack>
      <Skeleton h={1} />
      {true ? null : [1, 2, 3].map((_, i) => (
        <HStack
          key={i}
          pt={"6"}
          p='1'
          alignItems={"center"}
        >
          <HStack flex={1} alignItems={"center"} space={4}>
            <Skeleton size="8" rounded="md" />
            <Skeleton maxW={"48"} h="5" rounded="full" />
          </HStack>
          <Box w={20}>
            <Skeleton h="5" rounded="full" />
          </Box>
        </HStack>
      ))}
      <Box pt={6}>
        <Skeleton rounded="md" h={"24"} startColor={"gray.100"} />
      </Box>
    </Box>
  )
}

