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
import { showToast } from "../../components/showToast";

const tableSchema = z.object({
  admin: z.string().optional(),
  totalUsers: z.number({
    required_error: "Please, enter the number of guests",
  }),
})

export const TableModal = () => {
  const router = useRouter()
  const { t } = useTranslation("businessTables")

  const SideBySideTabConfig: RegularInputConfig = {
    totalUsers: {
      name: "totalUsers",
      label: t("numberOfGuests"),
      placeholder: t("selectedNumberOfGuests"),
      inputType: "Number",
    }
  }

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
      router.push({
        pathname: businessRoute["add-to-order"],
        query: { tabId: data.createTab._id }
      })
    },
    onError: (error) => {
      showToast({
        status: "error",
        message: t("errorCreatingTab"),
      })
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

        // if the state of the tab is not open, it means a checkout was requested
        // navigate to checkout
        // if (tableChoosen?.tab) { }

        router.push({
          pathname: businessRoute["add-to-order"],
          query: { tabId: tableChoosen?.tab?._id }
        })
        break;
    }

  }, [createTab, router, tableChoosen])

  const onCancel = () => {
    setTableChoosen(undefined)
    reset()
    clearErrors()
  }

  console.log(`isOcuppiedTable ? t("addNewItem") : t("openTab")`, isOcuppiedTable ? t("addNewItem") : t("openTab"))

  return (
    <>
      <DevTool control={control} />

      <CustomModal
        size={isOcuppiedTable ? "full" : "lg"}
        isOpen={!!tableChoosen}
        HeaderComponent={
          <>
            <Text fontSize={"20"}>
              {`${t("table")} ${tableChoosen?.tableNumber}`}
            </Text>
            <Badge
              mt={2}
              width={'20'}
              colorScheme={badgeScheme(tableChoosen?.status)}>
              {!!tableChoosen?.status && t(tableChoosen?.status)}
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
            <Button flex={1} w={"200px"} variant="outline" colorScheme="tertiary" onPress={onCancel}>
              {t("cancel")}
            </Button>
            <Button flex={1} w={"200px"}
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