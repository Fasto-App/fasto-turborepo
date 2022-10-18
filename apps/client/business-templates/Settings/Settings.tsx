import { Box, Button, FlatList, Heading, HStack, VStack } from 'native-base'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { typedKeys } from '../../authUtilities/utils'
import { ControlledForm } from '../../components/ControlledForm/ControlledForm'
import { ControlledInput, InputProps } from '../../components/ControlledForm/ControlledInput'
import { ManageBusinessConfig, ManageAccountConfig } from './Config'
import { AccountInfo, BusinessInfo, useManageAccountFormHook, useManageBusinessFormHook } from './hooks'


const texts = {
  title: "Change Account Information",
  save: "Save",
  cancel: "cancel"
}

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

type Keys = keyof typeof manageTabs
type TabType = Exclude<Keys, "title">
const tabs = typedKeys(manageTabs)

export function Settings() {
  const [selectedTab, setSelectedTab] = useState<TabType>("manage_business")
  const SettingsSwitch = (selectedTab: TabType) => {
    switch (selectedTab) {
      case ("manage_business"):
        return <ManageBusiness />
      case "manage_account":
        return <ManageAccount />

    }
  }

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
    <VStack m={"4"} mt={12} space={"4"} flex={1}>
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
          {SettingsSwitch(selectedTab)}
        </Box>
      </Box>
    </VStack>
  )
}

const ManageBusiness = () => {

  const {
    control,
    formState,
    handleSubmit
  } = useManageBusinessFormHook()

  const handleSaveBusinessInfo = (values: BusinessInfo) => {
    console.log("values", values)
    alert(JSON.stringify(values))
  }

  return (
    <VStack>
      <HStack flex={1}>
        <ControlledForm
          control={control}
          formState={formState}
          Config={ManageBusinessConfig}
        />
        <Box w={"40%"} px={"4"} justifyContent={"space-between"}>
          <ControlledInput
            label='Upload Picture'
            name='uploadPicture'
            //@ts-ignore
            control={control}
          />
        </Box>
      </HStack>
      <HStack alignItems="center" space={2} justifyContent="end">
        <Button w={"100"} variant={"subtle"} onPress={() => console.log("Cancel")}>
          {texts.cancel}
        </Button>
        <Button
          w={"100"}
          colorScheme="tertiary"
          onPress={handleSubmit(handleSaveBusinessInfo)}>{texts.save}
        </Button>
      </HStack>
    </VStack>
  )
}

const ManageAccount = () => {

  const {
    control,
    formState,
    handleSubmit
  } = useManageAccountFormHook()

  const handleSaveAccountInfo = (values: AccountInfo) => {
    console.log("values", values)
    alert(JSON.stringify(values))
  }

  return (
    <HStack flex={1} flexDir={"column"}>
      <ControlledForm
        control={control}
        formState={formState}
        Config={ManageAccountConfig}
      />
      <Box>
        <HStack alignItems="center" space={2} justifyContent="end">
          <Button w={"100"} variant={"subtle"} onPress={() => console.log("Cancel")}>
            {texts.cancel}
          </Button>
          <Button
            w={"100"}
            colorScheme="tertiary"
            onPress={handleSubmit(handleSaveAccountInfo)}>{texts.save}
          </Button>
        </HStack>
      </Box>
    </HStack>
  )
}


