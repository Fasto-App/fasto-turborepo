import React from "react";
import { VStack, HStack, Button, } from "native-base"
import { ControlledForm, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm"
import { ManageLocationConfig } from "./Config"
import { useManageLocationFormHook, } from "./hooks"
import { businessLocationSchemaInput } from "app-helpers";
import { useGetBusinessLocationQuery, useUpdateBusinessLocationMutation } from "../../gen/generated";
import { DevTool } from "@hookform/devtools";
import { Loading } from "../../components/Loading";
import { useAppStore } from "../UseAppStore";
import { useTranslation } from "next-i18next";
import { showToast } from "../../components/showToast";

export const ManageBusinessLocation = () => {
  const { t } = useTranslation("businessSettings")

  const { data, loading: loadingQuery } = useGetBusinessLocationQuery({
    onCompleted: (data) => {
      setValue("streetAddress", data.getBusinessLocation?.streetAddress || "")
      setValue("city", data.getBusinessLocation?.city || "")
      setValue("stateOrProvince", data.getBusinessLocation?.stateOrProvince || "")
      setValue("postalCode", data.getBusinessLocation?.postalCode || "")
      setValue("country", data.getBusinessLocation?.country || "")
      setValue("complement", data.getBusinessLocation?.complement || "")
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
    setValue,
  } = useManageLocationFormHook(data?.getBusinessLocation)

  const [updateBusinessLocation, { loading }] = useUpdateBusinessLocationMutation({
    refetchQueries: ["GetBusinessLocation"],
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

  const handleSaveBusinessInfo = async (values: businessLocationSchemaInput) => {
    await updateBusinessLocation({
      variables: {
        input: values
      }
    })
  }

  const newManageLocationConfig = {
    ...ManageLocationConfig,
    streetAddress: {
      ...ManageLocationConfig.streetAddress,
      label: t("streetAddress"),
      placeholder: t("streetAddress")
    },
    complement: {
      ...ManageLocationConfig.complement,
      label: t("complement"),
      placeholder: t("complement")
    },
    postalCode: {
      ...ManageLocationConfig.postalCode,
      label: t("postalCode"),
      placeholder: t("postalCode")
    },
    city: {
      ...ManageLocationConfig.city,
      label: t("city"),
      placeholder: t("city")
    },
    stateOrProvince: {
      ...ManageLocationConfig.stateOrProvince,
      label: t("state"),
      placeholder: t("state")
    },
    country: {
      ...ManageLocationConfig.country,
      label: t("country"),
      placeholder: t("country"),
      isDisabled: !!data?.getBusinessLocation?.country
    },
  }

  return (
    <VStack space={"2"}>
      <DevTool control={control} />
      <ControlledForm
        control={control}
        formState={formState}
        Config={newManageLocationConfig}
      />
      <HStack pt={4} alignItems="center" space={4} justifyContent="end">
        <Button
          w={"30%"}
          variant={"subtle"}
          onPress={() => console.log("Cancel")}
          isLoading={loading}
        >
          {t("cancel")}
        </Button>
        <Button
          w={"30%"}
          colorScheme="tertiary"
          onPress={handleSubmit(handleSaveBusinessInfo)}
          isLoading={loading}
        >{t("save")}
        </Button>
      </HStack>
      <Loading isLoading={loadingQuery || loading} />
    </VStack>
  )
}