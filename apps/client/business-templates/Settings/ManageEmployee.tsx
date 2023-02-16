import React, { useMemo, useState, } from "react"
import { Box, Button, Heading, ScrollView, Text, VStack } from "native-base"
import { CustomModal } from "../../components/CustomModal/CustomModal"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { useManageEmployeeFormHook } from "./hooks"
import { ManageEmployeeConfig } from "./Config"
import { texts } from "./texts"
import { AddMoreButton } from "../../components/atoms/AddMoreButton"
import { ProductTile } from "../../components/Product/Product"
import { EmployeeInformation } from "app-helpers"
import { DevTool } from "@hookform/devtools"

const ManageEmployeeModal = ({
  isModalOpen, setIsModalOpen }:
  { isModalOpen: boolean, setIsModalOpen: (isOpen: boolean) => void }) => {
  const { control, formState, handleSubmit, reset } = useManageEmployeeFormHook()
  // TODO manage employee mutation

  const onSubmit = (data: EmployeeInformation) => {
    console.log("employee information", data)

    // send an email to the employee so they can go to the app and set their password
    // if the employee is already registered, send an email to the employee letting them know they have been added to the business


    // post data to backend and refresh query to fetch all employees
  }

  const onCancel = () => {
    // clear input values
    setIsModalOpen(false)
    reset()
  }

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
            >
              {texts.cancel}
            </Button>
            <Button
              flex={1}
              onPress={handleSubmit(onSubmit)}
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
  privileges: "Admin",
  role: "Server",
  imageUrl: "https://media.licdn.com/dms/image/C5603AQFFEa9a0Semfg/profile-displayphoto-shrink_800_800/0/1632369752400?e=1681948800&v=beta&t=55rO6SgLBvmKCjnh6Her5Tbk1VySLoebwbXD4YKC87U"
} as const;
const employeesData: typeof mock[] = new Array(5).fill(mock)

export const ManageEmployee = () => {
  const [isModalopen, setIsModalOpen] = useState(false)

  // add button to not empty array
  const employeesWithButton = useMemo(() => [{ name: "Button" } as const, ...employeesData], [])

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