import React, { useCallback, useMemo, useState, } from "react"
import { Box, Button, Heading, ScrollView, Text, VStack } from "native-base"
import { CustomModal } from "../../components/CustomModal/CustomModal"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { useManageEmployeeFormHook } from "./hooks"
import { ManageEmployeeConfig } from "./Config"
import { texts } from "./texts"
import { AddMoreButton } from "../../components/atoms/AddMoreButton"
import { ProductTile } from "../../components/Product/Product"
import { EmployeeInformation, typedValues } from "app-helpers"
import { DevTool } from "@hookform/devtools"
import { useManageBusinessEmployeesMutation, UserPrivileges } from "../../gen/generated"

const ManageEmployeeModal = ({
  isModalOpen, setIsModalOpen }:
  { isModalOpen: boolean, setIsModalOpen: (isOpen: boolean) => void }) => {
  const { control, formState, handleSubmit, reset } = useManageEmployeeFormHook()
  const [manageEmployee, { loading }] = useManageBusinessEmployeesMutation()

  const onCancel = useCallback(() => {
    setIsModalOpen(false)
    reset()
  }, [reset, setIsModalOpen])

  const onSubmit = useCallback(async (data: EmployeeInformation) => {
    console.log("employee information", data)

    await manageEmployee({
      variables: {
        input: {
          email: data.email,
          name: data.name,
          jobTitle: data.jobTitle,
          privilege: UserPrivileges[data.privilege as keyof typeof UserPrivileges],
          _id: data._id
        }
      }
    })

    onCancel()
  }, [manageEmployee, onCancel])

  return (
    <>
      <DevTool control={control} />
      <CustomModal
        isOpen={isModalOpen}
        onClose={onCancel}
        HeaderComponent={<Heading>{texts.addEmployee}</Heading>}
        ModalBody={
          <ControlledForm
            control={control}
            formState={formState}
            Config={ManageEmployeeConfig}
          />}
        ModalFooter={
          <>
            <Button
              flex={1}
              variant="outline"
              colorScheme="tertiary"
              onPress={onCancel}
              isLoading={loading}
            >
              {texts.cancel}
            </Button>
            <Button
              flex={1}
              onPress={handleSubmit(onSubmit)}
              isLoading={loading}
            >
              {texts.save}
            </Button>
          </>
        }
      />
    </>
  )
}

const mock = {
  _id: 1,
  name: "Alex Mendes",
  privilege: "Admin",
  role: "Server",
  imageUrl: "https://media.licdn.com/dms/image/C5603AQFFEa9a0Semfg/profile-displayphoto-shrink_800_800/0/1632369752400?e=1681948800&v=beta&t=55rO6SgLBvmKCjnh6Her5Tbk1VySLoebwbXD4YKC87U"
} as const;
const employeesData: typeof mock[] = new Array(15).fill(mock)

export const ManageEmployee = () => {
  const [isModalopen, setIsModalOpen] = useState(false)

  // add button to not empty array
  const employeesWithButton = useMemo(() => [{ name: "Button" } as const, ...employeesData], [])

  // get all employees and it's data, 
  // for those who we don't have the picture we will show an pic with the initial letters of the name


  return (
    <Box>
      <ManageEmployeeModal
        isModalOpen={isModalopen}
        setIsModalOpen={setIsModalOpen}
      />
      {!employeesData.length
        ?
        <VStack>
          <Text pt={5}>{texts.startAddingEmployees}</Text>
          <AddMoreButton
            onPress={() => setIsModalOpen(true)} empty={true} />
        </VStack>
        :
        <ScrollView pt={4}>
          <VStack flexDir={"row"} flexWrap={"wrap"} space={4}>
            {employeesWithButton.map((employee, index) => {
              if (employee?.name === "Button") {
                return <AddMoreButton
                  horizontal
                  key={"button"}
                  onPress={() => setIsModalOpen(true)}
                />
              }

              return (
                <ProductTile
                  ctaTitle="Edit"
                  key={employee._id + index}
                  name={employee.name}
                  imageUrl={employee.imageUrl}
                  onPress={() => console.log("Hello")}
                />
              )
            })}
          </VStack>
        </ScrollView>
      }
    </Box>
  )
}