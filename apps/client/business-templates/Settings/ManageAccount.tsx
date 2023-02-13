import React from "react"
import { HStack, Button, Box } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { texts } from "./texts"
import { ManageAccountConfig, uploadPicture } from "./Config"
import { useManageAccountFormHook } from "./hooks"
import { useUploadFileHook } from "../../hooks"
import { ControlledInput } from "../../components/ControlledForm"
import { DevTool } from "@hookform/devtools"
import { useGetUserInformationQuery, useUpdateUserInformationMutation } from "../../gen/generated"
import { AccountInformation } from "app-helpers"

export const ManageAccount = () => {
  const { data } = useGetUserInformationQuery({
    onCompleted: (data) => {
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
  const [updateUserInformation, { loading }] = useUpdateUserInformationMutation()

  const handleSaveAccountInfo = async (values: AccountInformation) => {
    await updateUserInformation({
      variables: {
        input: {
          name: values.name,
          email: values.email,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          newPasswordConfirmation: values.newPasswordConfirmation,
          picture: imageFile
        }
      }
    })
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
        src={imageSrc || data?.getUserInformation?.picture}
        control={control}
      />
      <Box>
        <HStack alignItems="center" space={2} justifyContent="end">
          <Button
            w={"100"}
            variant={"subtle"}
            onPress={() => console.log("Cancel")}
            isLoading={loading}
          >
            {texts.cancel}
          </Button>
          <Button
            w={"100"}
            colorScheme="tertiary"
            onPress={handleSubmit(handleSaveAccountInfo)}
            isLoading={loading}
          >{texts.save}
          </Button>
        </HStack>
      </Box>
    </HStack>
  )
}