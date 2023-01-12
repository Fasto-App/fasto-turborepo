import React, { useCallback } from "react"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge, Button, Modal, Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { OrderDetail, Table, User } from "../../gen/generated";
import { useTabMutationHook } from "../../graphQL/TabQL";
import { businessRoute } from "../../routes";
import { badgeScheme } from "./config";
import { OccupiedModal } from "./OccupiedModal";
import * as z from "zod"
import { SelectedTable } from "./types";

const tableSchema = z.object({
  admin: z.string().optional(),
  totalUsers: z.number({
    required_error: "Please, enter the number of guests",
  }),
})

const TabConfig: RegularInputConfig = {
  totalUsers: {
    name: "totalUsers",
    label: "Num Guests",
    placeholder: "Select number of guests",
    errorMessage: "Please, enter a number of guests",
    helperText: "Number of guests",
    formatOnChange: (value: string, fieldOnchange: (number) => void) => {
      if (Number.isInteger(Number(value))) {
        return fieldOnchange(Number(value))
      }
    }
  },
  admin: {
    name: "admin",
    label: "Admin",
    placeholder: "Select an admin user",
  },
}

const { totalUsers, admin } = TabConfig

const SideBySideTabConfig: SideBySideInputConfig = {
  info: [{ totalUsers }, { admin }]
}

const texts = {
  addNewItem: "Add New Item",
  openTab: "Open a New Tab",
  cancel: "Cancel",
}


export const TableModal = ({ tableChoosen, setTableChoosen }:
  { tableChoosen: SelectedTable, setTableChoosen: (table: SelectedTable) => void }) => {
  const router = useRouter()
  const { createTab } = useTabMutationHook();
  const isOcuppiedTable = tableChoosen?.status === "OCCUPIED"
  const isAvailableTable = tableChoosen?.status === "AVAILABLE"
  const isReservedTable = tableChoosen?.status === "RESERVED"
  const size = isOcuppiedTable ? "full" : "lg"

  const {
    control,
    formState,
    clearErrors,
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      admin: "",
      totalUsers: ""
    },
    resolver: zodResolver(tableSchema)
  })

  const onSubmit = useCallback(async (data: any) => {

    switch (tableChoosen?.status) {
      case "AVAILABLE":
        try {
          const result = await createTab({
            variables: {
              input: {
                table: tableChoosen._id,
                admin: data.admin,
                totalUsers: data.totalUsers
              }
            }
          })

          router.push(businessRoute.add_to_order(result.data.createTab._id, "635c687451cb178c2e214465"),)
        } catch { }
        break;

      case "OCCUPIED":
        console.log(tableChoosen)
        router.push(businessRoute.add_to_order(tableChoosen.tab, "635c687451cb178c2e214465"))
        break;
    }

  }, [createTab, router, tableChoosen])

  const onCancel = () => {
    setTableChoosen(null)
    reset()
    clearErrors()
  }

  return <Modal size={size} isOpen={!!tableChoosen} onClose={onCancel}>
    <DevTool control={control} />
    <Modal.CloseButton />
    <Modal.Content >
      <Modal.Header borderColor={"gray.50"}>
        {"Table " + tableChoosen?._id}
        <Badge mt={2} width={'20'} colorScheme={badgeScheme(tableChoosen?.status)}>
          {tableChoosen?.status?.toUpperCase() ?? "AVAILABLE"}</Badge>
      </Modal.Header>
      <Modal.Body>
        {isOcuppiedTable ? <OccupiedModal /> : isAvailableTable ?
          <ControlledForm
            control={control}
            formState={formState}
            Config={SideBySideTabConfig}
          /> : isReservedTable ? <>
            <Text>{"tableChoosen.reservation.name"}</Text>
            <Text>{"tableChoosen.reservation.phone"}</Text>
            <Text>{format(new Date(), "PPpp")}</Text>
          </> : null
        }
      </Modal.Body>
      <Modal.Footer borderColor={"gray.50"}>
        <Button.Group flex={1} justifyContent={"center"} space={4}>
          <Button w={"200px"} variant="outline" colorScheme="tertiary" onPress={onCancel}>
            {texts.cancel}
          </Button>
          <Button w={"200px"}
            onPress={isOcuppiedTable ? onSubmit : handleSubmit(onSubmit)}>
            {isOcuppiedTable ? texts.addNewItem : texts.openTab}
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal >
}