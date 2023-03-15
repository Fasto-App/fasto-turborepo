import { typedKeys } from 'app-helpers'
import { HStack, Heading, Divider, Pressable } from 'native-base'
import React, { Dispatch, SetStateAction } from 'react'

export type TabsType = {
  [key: string]: string
}

type FDSTabProps<T extends TabsType> = {
  tabs: T;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  selectedTab: keyof T;
}

export const FDSTab = <T extends TabsType>({ setSelectedTab, selectedTab, tabs }: FDSTabProps<T>) => {

  return (
    <HStack flex={1} justifyContent={"space-around"}>
      {typedKeys(tabs).map((key, index) => {
        return (
          <Pressable key={index} flex={1} onPress={() => setSelectedTab(key as string)}>
            <Heading
              size={"md"}
              textAlign={"center"}
              color={selectedTab === key ? undefined : "gray.400"}
            >
              {tabs[key]}
            </Heading>
            <Divider bg={selectedTab === key ? "gray.400" : "gray.300"} />
          </Pressable>
        )
      })}
    </HStack>
  )
}
