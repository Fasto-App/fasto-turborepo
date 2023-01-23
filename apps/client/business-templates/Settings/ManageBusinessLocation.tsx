import React from "react";
import { VStack, HStack, Button } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageLocationConfig } from "./Config"
import { useManageBusinessFormHook, } from "./hooks"
import { texts } from "./texts"
import { businessLocationSchemaInput } from "app-helpers";

export const ManageBusinessLocation = () => {
  const {
    control,
    formState,
    handleSubmit
  } = useManageBusinessFormHook()

  const handleSaveBusinessInfo = async (values: businessLocationSchemaInput) => {
    console.log(values, "values")
    // send information to backend
  }

  return (
    <VStack space={"2"}>
      <ControlledForm
        control={control}
        formState={formState}
        Config={ManageLocationConfig}
      />
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