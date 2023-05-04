import React, { useState } from "react"
import { HStack, Box, Button, Text } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageBusinessConfig, uploadPicture } from "./Config"
import { useManageBusinessFormHook } from "./hooks"
import { useUploadFileHook } from "../../hooks"
import { useGetBusinessInformationQuery, useUpdateBusinessInformationMutation } from "../../gen/generated"
import { ControlledInput } from "../../components/ControlledForm/ControlledInput"
import { WeeklySchedule } from "../../components/WeeklySchedule/WeeklySchedule"
import { businessInformationSchemaInput, DaysOfTheWeekArray, hoursOfOperationSchema } from "app-helpers"
import { shallow } from "zustand/shallow"
import { useScheduleStore } from "../../components/WeeklySchedule/scheduleStore"
import { DevTool } from "@hookform/devtools"
import { Loading } from "../../components/Loading"
import { useAppStore } from "../UseAppStore"
import { useTranslation } from "next-i18next"

export const ManageBusiness = () => {
  const setNetworkState = useAppStore(state => state.setNetworkState)

  const { daysOfTheWeek, setCloseHour, setOpenHour, toggleDay } = useScheduleStore(state => ({
    daysOfTheWeek: state.daysOfTheWeek,
    setOpenHour: state.setOpenHour,
    setCloseHour: state.setCloseHour,
    toggleDay: state.toggleDay,
  }), shallow)

  const { t } = useTranslation("businessSettings")

  const { data, loading: loadingQuery } = useGetBusinessInformationQuery({
    onCompleted: (data) => {
      setValue("name", data.getBusinessInformation.name)
      setValue("description", data.getBusinessInformation.description || "")

      const hoursOfOperation = data.getBusinessInformation.hoursOfOperation
      // FIX: This loop is blocking the UI thread
      // 01 find a way to just transfer this data to the store whitout looping through it
      // 02 or manage everything in the store and just pass the data to the form
      DaysOfTheWeekArray.forEach(day => {
        const open = hoursOfOperation?.[day]?.hours?.open
        const close = hoursOfOperation?.[day]?.hours?.close

        if (hoursOfOperation?.[day]?.isOpen && hoursOfOperation?.[day]?.hours && open && close) {
          toggleDay(day)
          setOpenHour(day, open)
          setCloseHour(day, close)
        }
      })
    },
    onError: () => {
      setNetworkState("error")
    }
  })

  const [updateBusinessInformationMutation, { loading }] = useUpdateBusinessInformationMutation({
    refetchQueries: ["GetBusinessInformation"],
    onCompleted: () => {
      setNetworkState("success")
    },
    onError: () => {
      setNetworkState("error")
    }
  })

  const {
    control,
    formState,
    handleSubmit,
    setValue
  } = useManageBusinessFormHook(data?.getBusinessInformation)

  const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()

  const [scheduleError, setScheduleError] = useState<string>()

  const handleSaveAccountInfo = async (values: businessInformationSchemaInput) => {
    setScheduleError(undefined)

    try {
      const validateDaysOfTheWeek = await hoursOfOperationSchema.parseAsync(daysOfTheWeek)
      console.log("validateDaysOfTheWeek", validateDaysOfTheWeek)

      await updateBusinessInformationMutation({
        variables: {
          input: {
            ...values,
            picture: imageFile,
            hoursOfOperation: validateDaysOfTheWeek
          }
        }
      })

    } catch (err) {
      console.log("set Error", err)
      setScheduleError(`Hours of operation must have opening and close time.`)
      return
    }
  }

  const ManageBusinessConfigNewConfig = {
    ...ManageBusinessConfig,
    name: {
      ...ManageBusinessConfig.name,
      label: t("businessName"),
      placeholder: t("businessName")
    },
    description: {
      ...ManageBusinessConfig.description,
      label: t("businessDescription"),
      placeholder: t("businessDescription")
    }
  }

  return (
    <HStack flex={1} flexDir={"column"} space={"4"}>
      <DevTool control={control} />
      <Box
        flexDirection={{
          base: "column",
          "2xl": "row"
        }}>
        <Box mr={8} flex={1}>
          <ControlledForm
            control={control}
            formState={formState}
            Config={ManageBusinessConfigNewConfig}
          />
        </Box>
        <Box w={"xs"}>
          <ControlledInput
            {...uploadPicture}
            label={t("uploadPicture")}
            handleOnChange={handleFileOnChange}
            src={imageSrc || data?.getBusinessInformation?.picture}
            control={control}
          />
        </Box>
      </Box>
      {/* Data should populate the component, but zustand should override locally */}
      {false ? <WeeklySchedule /> : null}
      {scheduleError ? <Text color={"red.500"}>{scheduleError}</Text> : null}
      <Box pt={4}>
        <HStack alignItems="center" space={2} justifyContent="end">
          <Button
            w={"100"}
            variant={"subtle"}
            onPress={() => console.log("Cancel")}
            isLoading={loading}
          >
            {t("cancel")}
          </Button>
          <Button
            w={"100"}
            colorScheme="tertiary"
            onPress={handleSubmit(handleSaveAccountInfo)}
            isLoading={loading}
          >
            {t("save")}
          </Button>
        </HStack>
      </Box>
      <Loading isLoading={loadingQuery || loading} />
    </HStack>
  )
}