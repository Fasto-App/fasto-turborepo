import { localeObj, typedKeys, Locale } from 'app-helpers'
import { Box, Button, FlatList, HStack, Heading, VStack } from 'native-base'
import React, { useState } from 'react'
import { ManageAccount } from './ManageAccount'
import { ManageBusiness } from './ManageBusiness'
import { ManageBusinessLocation } from './ManageLocation'
import { ManageEmployee } from './ManageEmployee'
import { texts } from './texts'
import { UpperSection } from '../../components/UpperSection'
import { OrangeBox } from '../../components/OrangeBox'
import { BottomSection } from '../../components/BottomSection'
import router from 'next/router'
import { FDSSelect } from "../../components/FDSSelect";

const manageTabs = {
  manage_business: {
    button_title: "Manage Restaurant",
    title: "Restaurant Info"
  },
  manage_business_location: {
    button_title: "Manage Location",
    title: "Restaurant Info"
  },
  manage_employee: {
    button_title: "Manage Employee",
    title: "Employees"
  },
  manage_account: {
    button_title: "Manage Account",
    title: "Account Info"
  }
} as const

type ManageTab = keyof typeof manageTabs

type ManageTabKeys = keyof typeof manageTabs
const tabs = typedKeys(manageTabs)

export const SettingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<ManageTabKeys>("manage_business")

  const renderCategories = ({ item }: { item: ManageTab }) => {
    const selected = selectedTab === item
    return (
      <Button
        px={4}
        m={0}
        minW={"100px"}
        borderColor={selected ? 'primary.500' : "gray.300"}
        disabled={selected}
        variant={selected ? 'outline' : 'outline'}
        colorScheme={selected ? "primary" : "black"}
        onPress={() => setSelectedTab(item)}
      >
        {manageTabs[item].button_title}
      </Button>
    )
  }

  return (
    <Box flex={1}>
      <OrangeBox />
      <VStack m={"4"} space={"4"} flex={1}>
        <UpperSection>
          <HStack justifyContent={"space-between"}>
            <Heading>
              {texts.title}
            </Heading>

            <FDSSelect
              w="70"
              h="8"
              array={localeObj}
              selectedValue={router.locale as Locale}
              setSelectedValue={(value) => {
                const path = router.asPath;
                return router.push(path, path, { locale: value });
              }} />
          </HStack>
          <FlatList
            horizontal
            data={tabs}
            renderItem={renderCategories}
            ItemSeparatorComponent={() => <Box w={4} />}
            keyExtractor={(item) => item}
          />
        </UpperSection>
        <BottomSection>
          <Box>
            {selectedTab === "manage_business_location" ? <ManageBusinessLocation /> :
              selectedTab === "manage_account" ? <ManageAccount /> :
                selectedTab === "manage_employee" ? <ManageEmployee /> :
                  selectedTab === "manage_business" ? <ManageBusiness /> : null}
          </Box>
        </BottomSection>
      </VStack>
    </Box>
  )
}


