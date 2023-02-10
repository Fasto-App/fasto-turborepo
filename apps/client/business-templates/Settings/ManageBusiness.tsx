import React from "react"
import { HStack, Box, Button } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageBusinessConfig, uploadPicture } from "./Config"
import { useManageBusinessFormHook } from "./hooks"
import { texts } from "./texts"
import { useUploadFileHook } from "../../hooks"
import { useGetBusinessInformationQuery, useUpdateBusinessInformationMutation } from "../../gen/generated"
import { ControlledInput } from "../../components/ControlledForm/ControlledInput"
import { WeeklySchedule } from "../../components/WeeklySchedule/WeeklySchedule"
import { businessInformationSchemaInput } from "app-helpers"
import { shallow } from "zustand/shallow"
import { useScheduleStore } from "../../components/WeeklySchedule/scheduleStore"
import { DevTool } from "@hookform/devtools"

export const ManageBusiness = () => {
  const { data } = useGetBusinessInformationQuery({
    onCompleted: (data) => {
      setValue("name", data.getBusinessInformation.name)
      setValue("description", data.getBusinessInformation.description || "")
    },
  })

  const [updateBusinessInformationMutation, { loading }] = useUpdateBusinessInformationMutation({
    refetchQueries: ["GetBusinessInformation"],
  })

  const { daysOfTheWeek } = useScheduleStore(state => ({
    daysOfTheWeek: state.daysOfTheWeek,
  }),
    shallow
  )

  const {
    control,
    formState,
    handleSubmit,
    setValue
  } = useManageBusinessFormHook(data?.getBusinessInformation)

  const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()

  const handleSaveAccountInfo = async (values: businessInformationSchemaInput) => {

    await updateBusinessInformationMutation({
      variables: {
        input: {
          ...values,
          picture: imageFile,
        }
      }
    })
  }

  return (
    <HStack flex={1} flexDir={"column"} space={"4"}>
      <DevTool control={control} />
      <ControlledForm
        control={control}
        formState={formState}
        Config={ManageBusinessConfig}
      />
      <ControlledInput
        {...uploadPicture}
        handleOnChange={handleFileOnChange}
        src={imageSrc || data?.getBusinessInformation?.picture}
        control={control}
      />
      <WeeklySchedule />
      <Box pt={4}>
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
          >
            {texts.save}
          </Button>
        </HStack>
      </Box>
    </HStack>
  )
}