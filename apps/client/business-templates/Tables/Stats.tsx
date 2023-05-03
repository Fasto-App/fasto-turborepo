import React from "react"
import { HStack, Heading, VStack, Text } from "native-base";
import { stats, borderColor } from "./config";
import { typedKeys } from "app-helpers";
import { TableStatus } from "../../gen/generated";
import { useTranslation } from "next-i18next";

type StatsProps = {
  [key in keyof typeof TableStatus]: number
}

export const Stats = (props: StatsProps) => {
  const { t } = useTranslation("businessTables")

  return (
    <HStack space={4} mr={8}>
      <Heading
        size={"md"}
        alignSelf={"center"}>{t("tables").toUpperCase()}</Heading>
      <VStack >
        {typedKeys(props).map((stat, i) =>
          <HStack
            key={`${stat}.${i}`}
            space={4} flex={1}>
            <Text flex={1} key={stat} color={borderColor(stat)}>
              {t(stats[stat].name)}
            </Text>
            <Text>
              {props[stat]}
            </Text>
          </HStack>
        )}
      </VStack>
    </HStack>
  )
}