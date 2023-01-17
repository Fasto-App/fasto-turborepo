import React from "react"
import { HStack, Button, Box } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { texts } from "./texts"
import { ManageAccountConfig } from "./Config"
import { useManageAccountFormHook, AccountInfo } from "./hooks"

export const ManageAccount = () => {

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