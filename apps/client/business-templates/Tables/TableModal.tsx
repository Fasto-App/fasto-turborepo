import React, { useCallback } from "react"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge, Button, Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { GetSpacesFromBusinessDocument, useCreateTabMutation, useGetTableByIdQuery } from "../../gen/generated";
import { businessRoute } from "../../routes";
import { badgeScheme } from "./config";
import { OccupiedModal } from "./OccupiedModal";
import * as z from "zod"
import { useTableScreenStore } from "./tableScreenStore";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { useTranslation } from "next-i18next";

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
    inputType: "Number",
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


export const TableModal = () => {
  const router = useRouter()
  const { t } = useTranslation("businessTables")

  const tableId = useTableScreenStore(state => state.tableChoosen)
  const setTableChoosen = useTableScreenStore(state => state.setTableChoosen)
  const { data, loading } = useGetTableByIdQuery({
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

  const [createTab] = useCreateTabMutation({
    refetchQueries: [{ query: GetSpacesFromBusinessDocument }],
    onCompleted: (data) => {
      router.push(businessRoute.add_to_order, { query: { tabId: data.createTab._id } })
    },
    onError: (error) => {
      console.log(error)
    }
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

    switch (tableChoosen?.status) {
      case "Available":

        if (!tableChoosen?._id) throw ("Table id is undefined")

        createTab({
          variables: {
            input: {
              table: tableChoosen?._id,
              admin: data.admin,
              totalUsers: data.totalUsers
            }
          }
        })

        break;

      case "Occupied":
        console.log(tableChoosen)

        if (!tableChoosen?.tab?._id) throw ("Tab id is undefined")
        router.push(businessRoute.add_to_order, { query: { tabId: tableChoosen?.tab?._id } })
        break;
    }

  }, [createTab, router, tableChoosen])

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
              {t("cancel")}
            </Button>
            <Button w={"200px"}
              onPress={isOcuppiedTable ? onSubmit : handleSubmit(onSubmit)}
              isLoading={loading}
            >
              {isOcuppiedTable ? t("addNewItem") : t("openTab")}
            </Button>
          </Button.Group>
        }
      />
    </>
  )
}