import React, { useMemo, useState, } from "react"
import { Box, Button, Heading, ScrollView, Text, VStack } from "native-base"
import { CustomModal } from "../../components/CustomModal/CustomModal"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { useManageEmployeeFormHook } from "./hooks"
import { ManageEmployeeConfig } from "./Config"
import { texts } from "./texts"
import { AddMoreButton, SmallAddMoreButton } from "../../components/atoms/AddMoreButton"
import { ProductTile } from "../../components/Product/Product"

const ManageEmployeeModal = ({
  isModalOpen, setIsModalOpen }:
  { isModalOpen: boolean, setIsModalOpen: (isOpen: boolean) => void }) => {
  const { control, formState, handleSubmit } = useManageEmployeeFormHook()

  return (
    <CustomModal
      isOpen={isModalOpen}
      onClose={() => console.log("Closing")}
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
            onPress={() => setIsModalOpen(false)}
          >
            {texts.cancel}
          </Button>
          <Button
            flex={1}
            onPress={() => console.log("saving information")}
          >
            {texts.save}
          </Button>
        </>
      }
    />
  )
}

const mock = {
  _id: 1,
  name: "Alex Mendes",
  role: "Server",
  imageUrl: "https://scontent.fcgh10-1.fna.fbcdn.net/v/t39.30808-6/313403685_956099322014600_7816717504008112381_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=jMIoTP12iRgAX8ac76I&_nc_oc=AQlACjg0K7cJ0KD_KXAjZZhNr7IhhlNIEOKxxCS-9NQfDqhesBzp2Vmud1YQwhbFL0tXHhUs_38L3gSgNgAjyQzx&tn=DyIDWBMfZAs-NAgt&_nc_ht=scontent.fcgh10-1.fna&oh=00_AfAaz4EPF63cK-XuUf-LUMztBxMcAb8ByrVbK6rggT_eeQ&oe=63CB537F"
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