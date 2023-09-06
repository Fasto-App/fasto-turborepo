import React from "react"
import { HStack, Button, Box, ScrollView } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageAccountConfig, uploadPicture } from "./Config"
import { useManageAccountFormHook } from "./hooks"
import { useUploadFileHook } from "../../hooks"
import { ControlledInput } from "../../components/ControlledForm"
import { DevTool } from "@hookform/devtools"
import { useGetUserInformationQuery, useUpdateUserInformationMutation } from "../../gen/generated"
import { AccountInformation } from "app-helpers"
import { Loading } from "../../components/Loading"
import { useAppStore } from "../UseAppStore"
import { useTranslation } from "next-i18next"
import { showToast } from "../../components/showToast"

export const ManageAccount = () => {
  const { t } = useTranslation("businessSettings")

  const { data, loading: loadingQuery } = useGetUserInformationQuery({
    onCompleted: (data) => {
      setValue("name", data?.getUserInformation?.name || "")
      setValue("email", data?.getUserInformation?.email || "")
    },
    onError: () => {
      showToast({
        message: "Error",
        status: "error"
      })
    }
  })

  const {
    control,
    formState,
    handleSubmit,
    setValue
  } = useManageAccountFormHook(data?.getUserInformation)

  const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()
  const [updateUserInformation, { loading }] = useUpdateUserInformationMutation({
    onCompleted: () => {
      showToast({ message: "Success" })
    },
    onError: () => {
      showToast({
        message: "Error",
        status: "error"
      })
    }
  })

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

  const newManageAccount = {
    ...ManageAccountConfig,
    name: {
      ...ManageAccountConfig.name,
      label: t("name"),
      placeholder: t("name"),
    },
    email: {
      ...ManageAccountConfig.email,
      label: t("email"),
      placeholder: t("email"),
    },
    oldPassword: {
      ...ManageAccountConfig.oldPassword,
      label: t("oldPassword"),
      placeholder: t("oldPassword"),
    },
    newPassword: {
      ...ManageAccountConfig.newPassword,
      label: t("newPassword"),
      placeholder: t("newPassword"),
    },
    newPasswordConfirmation: {
      ...ManageAccountConfig.newPasswordConfirmation,
      label: t("newPasswordConfirmation"),
      placeholder: t("newPasswordConfirmation"),
    },
  }

  return (
    <HStack flex={1} flexDir={"column"}>
      <DevTool control={control} />

      <ControlledForm
        control={control}
        formState={formState}
        Config={newManageAccount}
      />
      <ControlledInput
        {...uploadPicture}
        handleOnChange={handleFileOnChange}
        src={imageSrc || data?.getUserInformation?.picture}
        control={control}
        label={t("uploadPicture")}
      />
      <Box>
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
          >{t("save")}
          </Button>
        </HStack>
      </Box>
      <Loading isLoading={loadingQuery || loading} />
    </HStack>
  )
}