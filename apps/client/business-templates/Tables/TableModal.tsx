import React, { useCallback } from "react"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge, Button, Modal, Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { OrderDetail, Table, useGetAllMenusByBusinessIdQuery, useGetTabByIdQuery, User } from "../../gen/generated";
import { useTabMutationHook } from "../../graphQL/TabQL";
import { businessRoute } from "../../routes";
import { badgeScheme } from "./config";
import { OccupiedModal } from "./OccupiedModal";
import * as z from "zod"
import { SelectedTable } from "./types";
import { useTableScreenStore } from "./tableScreenStore";

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
    formatOnChange: (value: string, fieldOnchange: (num: number) => void) => {
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


export const TableModal = () => {
  const router = useRouter()
  const { createTab } = useTabMutationHook();

  const tableChoosen = useTableScreenStore(state => state.tableChoosen)
  const setTableChoosen = useTableScreenStore(state => state.setTableChoosen)

  const isOcuppiedTable = tableChoosen?.status === "Occupied"
  const isAvailableTable = tableChoosen?.status === "Available"
  const isReservedTable = tableChoosen?.status === "Reserved"

  const { data: menusData, loading: loadingGetMenus } = useGetAllMenusByBusinessIdQuery();

  // get all the menus from a business

  // store the id and go through the array of orders
  // fetch information for an specific TAB 
  const { data } = useGetTabByIdQuery({
    variables: {
      input: {
        _id: `${tableChoosen?.tab}`
      }
    },
    skip: !tableChoosen?.tab
  })

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
    const menuId = menusData?.getAllMenusByBusinessID[0]._id

    if (!menuId) throw ("Menu id is undefined")

    switch (tableChoosen?.status) {
      case "Available":
        try {

          if (!tableChoosen?._id) throw ("Table id is undefined")

          const result = await createTab({
            variables: {
              input: {
                table: tableChoosen?._id,
                admin: data.admin,
                totalUsers: data.totalUsers
              }
            }
          })

          router.push(businessRoute.add_to_order(`${result.data?.createTab._id}`, menuId))
        } catch { }
        break;

      case "Occupied":
        console.log(tableChoosen)
        router.push(businessRoute.add_to_order(`${tableChoosen?.tab}`, menuId))
        break;
    }

  }, [createTab, menusData?.getAllMenusByBusinessID, router, tableChoosen])

  const onCancel = () => {
    setTableChoosen(undefined)
    reset()
    clearErrors()
  }

  return <Modal
    size={isOcuppiedTable ? "full" : "lg"}
    isOpen={!!tableChoosen}
    onClose={onCancel}
  >
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
            onPress={isOcuppiedTable ? onSubmit : handleSubmit(onSubmit)}
            isLoading={loadingGetMenus}
          >
            {isOcuppiedTable ? texts.addNewItem : texts.openTab}
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal >
}