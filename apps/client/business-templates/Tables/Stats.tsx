import React from "react"
import { HStack, Heading, VStack, Text } from "native-base";
import { stats, borderColor } from "./config";
import { typedKeys } from "app-helpers";

export const Stats = () => (
  <HStack space={4} mr={8}>
    <Heading size={"md"} alignSelf={"center"}>TABLES</Heading>
    <VStack >
      {typedKeys(stats).map(stat =>
        <Text flex={1} key={stat} color={borderColor(stat)}>
          {stats[stat].name}
        </Text>
      )}
    </VStack>
    <VStack >
      {typedKeys(stats).map(key =>
        <Text flex={1} key={key}>
          {stats[key].number}
        </Text>
      )}
    </VStack>
  </HStack>
)