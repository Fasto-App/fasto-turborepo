import { localeObj, typedKeys, Locale } from 'app-helpers'
import { Box, Button, FlatList, HStack, Heading, ScrollView, VStack } from 'native-base'
import React, { useState } from 'react'
import { ManageAccount } from './ManageAccount'
import { ManageBusiness } from './ManageBusiness'
import { ManageBusinessLocation } from './ManageLocation'
import { ManageEmployee } from './ManageEmployee'
import { UpperSection } from '../../components/UpperSection'
import { OrangeBox } from '../../components/OrangeBox'
import { BottomSection } from '../../components/BottomSection'
import router from 'next/router'
import { FDSSelect } from "../../components/FDSSelect";
import { useTranslation } from "next-i18next";

const manageTabs = {
  manageBusiness: {
    button_title: "manageBusiness",
  },
  manageLocation: {
    button_title: "manageLocation",
  },
  manageEmployees: {
    button_title: "manageEmployees",
  },
  manageAccount: {
    button_title: "manageAccount",
  }
} as const

type ManageTab = keyof typeof manageTabs

type ManageTabKeys = keyof typeof manageTabs
const tabs = typedKeys(manageTabs)

export const SettingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<ManageTabKeys>("manageBusiness")

  const { t } = useTranslation("businessSettings")

  const renderCategories = ({ item }: { item: ManageTab }) => {
    const selected = selectedTab === item
    return (
      <Button
        px={4}
        m={0}
        minW={"100px"}
        borderColor={selected ? 'primary.500' : "gray.300"}
        isDisabled={selected}
        variant={selected ? 'outline' : 'outline'}
        colorScheme={selected ? "primary" : "black"}
        onPress={() => setSelectedTab(item)}
      >
        {t(manageTabs[item].button_title)}
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
              {t("title")}
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
          <ScrollView>
            {selectedTab === "manageLocation" ? <ManageBusinessLocation /> :
              selectedTab === "manageAccount" ? <ManageAccount /> :
                selectedTab === "manageEmployees" ? <ManageEmployee /> :
                  selectedTab === "manageBusiness" ? <ManageBusiness /> : null}
          </ScrollView>
        </BottomSection>
      </VStack>
    </Box>
  )
}


