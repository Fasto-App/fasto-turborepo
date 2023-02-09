import React from "react";
import { VStack, HStack, Button, } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageLocationConfig } from "./Config"
import { useManageLocationFormHook, } from "./hooks"
import { texts } from "./texts"
import { businessLocationSchemaInput } from "app-helpers";
import { useGetBusinessLocationQuery, useUpdateBusinessLocationMutation } from "../../gen/generated";
import { DevTool } from "@hookform/devtools";

export const ManageBusinessLocation = () => {
  const { data } = useGetBusinessLocationQuery({
    onCompleted: (data) => {
      setValue("streetAddress", data.getBusinessLocation?.streetAddress || "")
      setValue("city", data.getBusinessLocation?.city || "")
      setValue("stateOrProvince", data.getBusinessLocation?.stateOrProvince || "")
      setValue("postalCode", data.getBusinessLocation?.postalCode || "")
      setValue("country", data.getBusinessLocation?.country || "")
      setValue("complement", data.getBusinessLocation?.complement || "")
    }
  })

  const {
    control,
    formState,
    handleSubmit,
    setValue,
  } = useManageLocationFormHook(data?.getBusinessLocation)

  const [updateBusinessLocation, { loading }] = useUpdateBusinessLocationMutation({
    refetchQueries: ["GetBusinessLocation"]
  })

  const handleSaveBusinessInfo = async (values: businessLocationSchemaInput) => {
    await updateBusinessLocation({
      variables: {
        input: values
      }
    })
  }

  return (
    <VStack space={"2"}>
      <DevTool control={control} /> {/* set up the dev tool */}
      <ControlledForm
        control={control}
        formState={formState}
        Config={ManageLocationConfig}
      />
      <HStack pt={4} alignItems="center" space={4} justifyContent="end">
        <Button
          w={"30%"}
          variant={"subtle"}
          onPress={() => console.log("Cancel")}
          isLoading={loading}
        >
          {texts.cancel}
        </Button>
        <Button
          w={"30%"}
          colorScheme="tertiary"
          onPress={handleSubmit(handleSaveBusinessInfo)}
          isLoading={loading}
        >{texts.save}
        </Button>
      </HStack>
    </VStack>
  )
}