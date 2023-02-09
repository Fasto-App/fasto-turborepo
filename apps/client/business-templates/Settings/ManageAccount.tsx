import React from "react"
import { HStack, Button, Box } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { texts } from "./texts"
import { ManageAccountConfig, uploadPicture } from "./Config"
import { useManageAccountFormHook } from "./hooks"
import { useUploadFileHook } from "../../hooks"
import { ControlledInput } from "../../components/ControlledForm"
import { DevTool } from "@hookform/devtools"
import { useGetUserInformationQuery } from "../../gen/generated"
import { AccountInformation } from "app-helpers"

export const ManageAccount = () => {
  // All users have names, get the name from the user object
  // QUERY: Get the user's name, email, and password

  const { data } = useGetUserInformationQuery({
    onCompleted: (data) => {
      console.log("data", data)
      setValue("name", data?.getUserInformation?.name || "")
      setValue("email", data?.getUserInformation?.email || "")
    }
  })

  const {
    control,
    formState,
    handleSubmit,
    setValue
  } = useManageAccountFormHook(data?.getUserInformation)

  const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()

  const handleSaveAccountInfo = (values: AccountInformation) => {

    console.log("imageFile", imageFile)
    console.log("values", values)
    alert(JSON.stringify(values))
  }

  return (
    <HStack flex={1} flexDir={"column"}>
      <DevTool control={control} />
      <ControlledForm
        control={control}
        formState={formState}
        Config={ManageAccountConfig}
      />
      <ControlledInput
        {...uploadPicture}
        handleOnChange={handleFileOnChange}
        src={imageSrc}
        control={control}
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