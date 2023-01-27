import React from "react"
import { HStack, Box, Button } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageBusinessConfig, uploadPicture } from "./Config"
import { useManageAccountFormHook, AccountInfo } from "./hooks"
import { texts } from "./texts"
import { useUploadFileHook } from "../../hooks"
import { useUploadFileMutation } from "../../gen/generated"
import { ControlledInput } from "../../components/ControlledForm/ControlledInput"
import { WeeklySchedule } from "../../components/WeeklySchedule/WeeklySchedule"

export const ManageBusiness = () => {

  const [uploadFile] = useUploadFileMutation({
    onCompleted: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  // [] Create a separate hook that conform with the hours config.
  // [] 
  const {
    control,
    formState,
    handleSubmit
  } = useManageAccountFormHook()
  const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()

  const handleSaveAccountInfo = async (values: AccountInfo) => {
    console.log("values", values)
    alert(JSON.stringify(values))

    // this may or may not have a ImageFile
    // if it does, then upload the file
    // if it doesn't, then just make the mutation to post Address information
    if (!imageFile) {
      // make the mutation to post Address information
      return
    }

    const { data } = await uploadFile({
      variables: {
        file: imageFile
      },
    })

    console.log("data", data?.uploadFile)
  }

  return (
    <HStack flex={1} flexDir={"column"} space={"4"}>
      <ControlledForm
        control={control}
        formState={formState}
        Config={ManageBusinessConfig}
      />
      <ControlledInput
        {...uploadPicture}
        handleOnChange={handleFileOnChange}
        src={imageSrc}
        control={control}
      />
      <WeeklySchedule />
      <Box pt={4}>
        <HStack alignItems="center" space={2} justifyContent="end">
          <Button w={"100"} variant={"subtle"} onPress={() => console.log("Cancel")}>
            {texts.cancel}
          </Button>
          <Button
            w={"100"}
            colorScheme="tertiary"
            onPress={handleSubmit(handleSaveAccountInfo)}
          >
            {texts.save}
          </Button>
        </HStack>
      </Box>
    </HStack>
  )
}