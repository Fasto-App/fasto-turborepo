import React from "react";
import { VStack, HStack, Box, Button } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ControlledInput } from "../../components/ControlledForm/ControlledInput"
import { ManageBusinessConfig } from "./Config"
import { useManageBusinessFormHook, } from "./hooks"
import { texts } from "./texts"
import { businessInfoSchemaInput } from "app-helpers";

export const ManageBusiness = () => {

  const {
    control,
    formState,
    handleSubmit
  } = useManageBusinessFormHook()

  const handleSaveBusinessInfo = (values: businessInfoSchemaInput) => {
    console.log("values", values)
    alert(JSON.stringify(values))
  }

  // SPREAD THE PHOTO KEY CONFIG OBJECT
  // RENDER ANOTHER INPUT COMPONENT OF TYPE FILE
  // WITH THE STATE UPDATED ON CHANGE
  // WUEN THE INPUT HAS THE SRC OF THE IMAGE
  // RENDER THE IMAGE INSTEAD OF THE PLACEHOLDER
  const {

  } = ManageBusinessConfig

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