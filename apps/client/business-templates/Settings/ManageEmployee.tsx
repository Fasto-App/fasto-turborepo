import React, { useCallback, useMemo, useState, } from "react"
import { Box, Button, Divider, Heading, HStack, ScrollView, Text, VStack } from "native-base"
import { CustomModal } from "../../components/CustomModal/CustomModal"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { useManageEmployeeFormHook } from "./hooks"
import { ManageEmployeeConfig } from "./Config"
// import { texts } from "./texts"
import { AddMoreButton } from "../../components/atoms/AddMoreButton"
import { DICE_BEAR_INITIALS_URL, EmployeeInformation } from "app-helpers"
import { DevTool } from "@hookform/devtools"
import { useDeleteBusinessEmployeeMutation, useGetAllEmployeesQuery, useManageBusinessEmployeesMutation, UserPrivileges } from "../../gen/generated"
import { MoreButton } from "../../components/MoreButton"
import { EmployeeTile } from "../../components/BorderTile"
import { DeleteAlert } from "../../components/DeleteAlert"
import { Loading } from "../../components/Loading"
import { useAppStore } from "../UseAppStore"
import { useTranslation } from "next-i18next"

export const ManageEmployee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const setNetworkState = useAppStore(state => state.setNetworkState)

  const { t } = useTranslation("businessSettings")

  const { data, loading: loadingQuery } = useGetAllEmployeesQuery({
    onError: () => {
      setNetworkState("error")
    }
  });

  const combinedData = useMemo(() => {
    const employees = data?.getAllEmployees?.employees ?? []
    const employeesPending = data?.getAllEmployees?.employeesPending ?? []

    return [...employees, ...employeesPending]
  }, [data?.getAllEmployees?.employees, data?.getAllEmployees?.employeesPending])

  const { control, formState, handleSubmit, reset, setValue, getValues } = useManageEmployeeFormHook()

  const [manageEmployee, { loading }] = useManageBusinessEmployeesMutation({
    refetchQueries: ["GetAllEmployees"],
    onCompleted: () => {
      setNetworkState("success")
    },
    onError: () => {
      setNetworkState("error")
    }
  })

  const onCancel = useCallback(() => {
    setIsModalOpen(false)
    reset()
  }, [reset, setIsModalOpen])

  const onSubmit = useCallback(async (data: EmployeeInformation) => {

    await manageEmployee({
      variables: {
        input: {
          email: data.email,
          name: data.name,
          jobTitle: data.jobTitle,
          privilege: UserPrivileges[data.privilege as keyof typeof UserPrivileges],
          isPending: data.isPending,
          _id: data._id
        }
      }
    })

    onCancel()
  }, [manageEmployee, onCancel])

  const onEditPressed = useCallback((employee: EmployeeInformation) => {
    setValue("name", employee.name)
    setValue("email", employee.email)
    setValue("jobTitle", employee.jobTitle)
    setValue("privilege", employee.privilege)
    setValue("_id", employee._id)
    setValue("isPending", employee.isPending)

    setIsModalOpen(true)
  }, [setValue])

  const isEditingConfig = useMemo(() => {

    return ({
      ...ManageEmployeeConfig,
      name: {
        ...ManageEmployeeConfig.name,
        isDisabled: !!getValues("_id"),
        label: t("name"),
      },
      jobTitle: {
        ...ManageEmployeeConfig.jobTitle,
        label: t("jobTitle"),
      },
      privilege: {
        ...ManageEmployeeConfig.privileges,
        label: t("privileges"),
      },
      email: {
        ...ManageEmployeeConfig.email,
        isDisabled: !!getValues("_id"),
        label: t("email"),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("_id")])

  const [deleteBusinessEmployee, { loading: loadingDelete }] = useDeleteBusinessEmployeeMutation({
    refetchQueries: ["GetAllEmployees"]
  })

  const deleteEmployeeCB = useCallback(async () => {
    const _id = getValues("_id")

    if (!_id) throw new Error("No _id found")

    await deleteBusinessEmployee({
      variables: {
        input: {
          _id
        }
      }
    })

    onCancel()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("_id")])

  return (
    <Box>
      <DevTool control={control} />
      <CustomModal
        isOpen={isModalOpen}
        onClose={onCancel}
        HeaderComponent={<Heading>{t("addEmployee")}</Heading>}
        ModalBody={
          <>
            <ControlledForm
              // @ts-ignore
              control={control}
              // @ts-ignore
              formState={formState}
              Config={isEditingConfig}
            />
            {getValues("_id") ?
              <Box pt={4}>
                <DeleteAlert deleteItem={deleteEmployeeCB} title={t("delete")} />
              </Box>
              : null}
          </>
        }
        ModalFooter={
          <>
            <Button
              flex={1}
              variant="outline"
              colorScheme="tertiary"
              onPress={onCancel}
              isLoading={loading}
            >
              {t("cancel")}
            </Button>
            <Button
              flex={1}
              onPress={handleSubmit(onSubmit)}
              isLoading={loading}
            >
              {t("save")}
            </Button>
          </>
        }
      />
      <HStack alignItems={"center"} space={4}>
        <Heading size={"lg"}>
          {"Employees"}
        </Heading>
        <MoreButton onPress={() => setIsModalOpen(true)} />
      </HStack>
      {!combinedData.length
        ?
        <VStack>
          <Text pt={5}>{t("startAddingEmployees")}</Text>
          <AddMoreButton
            onPress={() => setIsModalOpen(true)} empty={true} />
        </VStack>
        :
        <ScrollView pt={6}>
          <VStack flexDir={"row"} flexWrap={"wrap"} space={4}>
            {combinedData.map((employee, index) => {
              return (
                <EmployeeTile
                  key={employee._id}
                  email={employee.email}
                  jobTitle={employee.jobTitle}
                  name={employee.name}
                  privilege={employee.privilege}
                  picture={employee.picture || DICE_BEAR_INITIALS_URL(employee.name)}
                  ctaTitle={"Edit"}
                  isPending={employee.isPending}
                  onPress={() => onEditPressed(employee)}
                />
              )
            })}
          </VStack>
        </ScrollView>
      }
      <Loading isLoading={loadingQuery || loading || loadingDelete} />
    </Box>
  )
}