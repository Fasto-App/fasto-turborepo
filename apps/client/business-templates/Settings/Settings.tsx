import { Box, Button, FlatList, Heading, VStack } from 'native-base'
import React, { useState } from 'react'
import { typedKeys } from '../../authUtilities/utils'
import { ManageAccount } from './ManageAccount'
import { ManageBusiness } from './ManageBusiness'
import { ManageEmployee } from './ManageEmployee'
import { texts } from './texts'

const manageTabs = {
  manage_business: {
    button_title: "Manage Restaurant",
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
}

type ManageTabKeys = keyof typeof manageTabs
const tabs = typedKeys(manageTabs)

export const Settings = () => {
  const [selectedTab, setSelectedTab] = useState<ManageTabKeys>("manage_business")

  const renderCategories = ({ item }) => {
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
    <VStack m={"4"} space={"4"} flex={1}>

      <VStack
        space={"2"}
        p={"4"}
        shadow={"4"}
        borderWidth={1}
        borderRadius={"md"}
        borderColor={"trueGray.400"}
        backgroundColor={"white"}
        flexDirection={"column"}
      >
        <Heading>
          {texts.title}
        </Heading>
        <FlatList
          horizontal
          data={tabs}
          renderItem={renderCategories}
          ItemSeparatorComponent={() => <Box w={4} />}
          keyExtractor={(item) => item}
        />
      </VStack>

      <Box
        p={"4"}
        flex={1}
        borderWidth={1}
        borderRadius={"md"}
        borderColor={"trueGray.400"}
        backgroundColor={"white"}
        overflow={"scroll"}
      >
        <Heading>
          {manageTabs[selectedTab].title}
        </Heading>
        <Box>
          {selectedTab === "manage_business" ? <ManageBusiness /> :
            selectedTab === "manage_account" ? <ManageAccount /> : <ManageEmployee />}
        </Box>
      </Box>
    </VStack>
  )
}


