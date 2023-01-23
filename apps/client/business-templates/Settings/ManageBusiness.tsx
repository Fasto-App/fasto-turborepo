import React from "react"
import { HStack, Box, Button } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageBusinessConfig, uploadPicture } from "./Config"
import { useManageAccountFormHook, AccountInfo } from "./hooks"
import { texts } from "./texts"
import { useUploadFileHook } from "../../hooks"
import { useUploadFileMutation } from "../../gen/generated"
import { ControlledInput } from "../../components/ControlledForm/ControlledInput"



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


    const { data } = await uploadFile({
      variables: {
        file: imageFile
      }
    })

    console.log("data", data.uploadFile)
  }

  return (
    <HStack flex={1} flexDir={"column"}>
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