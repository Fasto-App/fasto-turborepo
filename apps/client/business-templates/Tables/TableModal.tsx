import React, { useCallback } from "react"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge, Button, Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { OrderDetail, Table, useGetAllMenusByBusinessIdQuery, useGetTabByIdQuery, useGetTableByIdQuery, User } from "../../gen/generated";
import { useTabMutationHook } from "../../graphQL/TabQL";
import { businessRoute } from "../../routes";
import { badgeScheme } from "./config";
import { OccupiedModal } from "./OccupiedModal";
import * as z from "zod"
import { useTableScreenStore } from "./tableScreenStore";
import { CustomModal } from "../../components/CustomModal/CustomModal";

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

  const tableId = useTableScreenStore(state => state.tableChoosen)
  const setTableChoosen = useTableScreenStore(state => state.setTableChoosen)
  const { data } = useGetTableByIdQuery({
    skip: !tableId,
    variables: {
      input: {
        _id: tableId!
      }
    }
  })

  const tableChoosen = data?.getTableById

  // fetch to get information about the table
  const isOcuppiedTable = tableChoosen?.status === "Occupied"
  const isAvailableTable = tableChoosen?.status === "Available"
  const isReservedTable = tableChoosen?.status === "Reserved"

  const { data: menusData, loading: loadingGetMenus } = useGetAllMenusByBusinessIdQuery();

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
        router.push(businessRoute.add_to_order(`${tableChoosen?.tab?._id}`, menuId))
        break;
    }

  }, [createTab, menusData?.getAllMenusByBusinessID, router, tableChoosen])

  const onCancel = () => {
    setTableChoosen(undefined)
    reset()
    clearErrors()
  }

  return (
    <>
      <DevTool control={control} />

      <CustomModal
        size={isOcuppiedTable ? "full" : "lg"}
        isOpen={!!tableChoosen}
        HeaderComponent={
          <>
            <Text fontSize={"20"}>
              {"Table " + tableChoosen?.tableNumber}
            </Text>
            <Badge mt={2} width={'20'} colorScheme={badgeScheme(tableChoosen?.status)}>
              {tableChoosen?.status?.toUpperCase() ?? "AVAILABLE"}
            </Badge>
          </>}
        ModalBody={
          isOcuppiedTable ? <OccupiedModal
            orders={tableChoosen?.tab?.orders}
            users={tableChoosen?.tab?.users}
          /> : isAvailableTable ?
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
        ModalFooter={
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
        }
      />
    </>
  )
}