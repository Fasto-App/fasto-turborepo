import React from "react";
import { VStack, HStack, Button } from "native-base"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { ManageLocationConfig } from "./Config"
import { useManageBusinessFormHook, } from "./hooks"
import { texts } from "./texts"
import { businessLocationSchemaInput } from "app-helpers";
import { useGetBusinessLocationQuery, useUpdateBusinessLocationMutation } from "../../gen/generated";
import { DevTool } from "@hookform/devtools";

export const ManageBusinessLocation = () => {
  const {
    control,
    formState,
    handleSubmit,
    reset
  } = useManageBusinessFormHook()

  const { data } = useGetBusinessLocationQuery({
    onCompleted: (data) => {

      const locationData = data.getBusinessLocation
      reset({
        ...locationData,
        complement: locationData?.complement ?? "",
      })
    }
  })

  const [updateBusinessLocation, { loading }] = useUpdateBusinessLocationMutation({
    refetchQueries: ["GetBusinessLocation"]
  })

  console.log("Location Data", data)

  const handleSaveBusinessInfo = async (values: businessLocationSchemaInput) => {
    console.log(values, "values")

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
          onPress={handleSubmit(handleSaveBusinessInfo)}
          isLoading={loading}
        >{texts.save}

        </Button>
      </HStack>
    </VStack>
  )
}