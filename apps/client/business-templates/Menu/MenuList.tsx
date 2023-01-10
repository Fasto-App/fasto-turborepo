import React, { useState } from 'react'
import { Box, Button, FlatList, FormControl, Heading, HStack, Input, Modal, Pressable, ScrollView, Text, VStack } from 'native-base'
import { AddMoreButton, SmallAddMoreButton } from '../../components/atoms/AddMoreButton';
import { Controller } from 'react-hook-form';
import { useAppStore } from '../UseAppStore';
import { AllAndEditButtons } from '../AllAndAddButons';
import { Tile } from '../../components/Tile';

const texts = {
  title: "Menu",
  emptyListText: "Start adding Menus by clicking in the button above.",
}

const allMenus = new Array(30).fill({
  name: "Weekends",
  _id: "123"
})

export function MenuList({ menuController, onMenuSubmit, menusData }) {
  const [showModal, setShowModal] = useState(false)
  const setMenu = useAppStore(state => state.setMenu)
  const menu = useAppStore(state => state.menu ?? menusData?.[0]?._id)
  const resetEditingAndSectionMap = useAppStore(state => state.resetEditingAndSectionMap)

  return (
    <Box
      p={"4"}
      shadow={"4"}
      borderWidth={1}
      borderRadius={"md"}
      borderColor={"trueGray.400"}
      backgroundColor={"white"}
      flexDirection={"row"}
    >
      <Box flex={1}>
        <Box flexDirection={"row"} mb={"2"}>
          <Heading flex={1}>
            {texts.title}
          </Heading>
        </Box>

        <VStack space={4}>
          <HStack space={2}>
            <SmallAddMoreButton onPress={() => console.log("Hello")} />
            <ScrollView horizontal={true} pb={2}>
              <HStack space={2}>
                {menusData?.map((item) => (
                  <Tile
                    key={item._id}
                    selected={item._id === menu}
                    onPress={() => {
                      setMenu(item._id)
                      resetEditingAndSectionMap()
                    }}
                  >
                    {item.name}
                  </Tile>
                ))}
              </HStack>
            </ScrollView>
          </HStack>
          <AllAndEditButtons allAction={undefined} editAction={undefined} categoryId={true} />
        </VStack>
      </Box>

      <MenuModal
        setShowModal={setShowModal}
        showModal={showModal}
        menuControl={menuController}
        onMenuSubmit={onMenuSubmit}
      />
    </Box>
  );
}

const textsMenu = {
  addMenu: "Add Menu",
  editMenu: "Edit Menu",
  menuName: "Menu Name",
  maxChar: "Max. 50 characters",
  errorMenu: "Menu name is required",
  add: "Add",
  cancel: "Cancel",
  edit: "Edit",
}

const MenuModal = ({ showModal, setShowModal, menuControl, onMenuSubmit }) => {
  const isEditing = false;
  const isInvalid = false;

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="40%" minW={"400px"}>
        <Modal.CloseButton />
        <Modal.Header>{isEditing ? textsMenu.editMenu : textsMenu.addMenu}</Modal.Header>
        <Modal.Body>
          {/* Name */}
          <FormControl isInvalid={isInvalid}>
            <FormControl.Label isRequired={!isEditing}>
              {textsMenu.menuName}
            </FormControl.Label>

            <Controller
              name="name"
              control={menuControl}
              rules={{ required: true, validate: (value) => !!(value.length >= 3) }}
              render={({ field }) => {
                return (
                  <Input {...field} placeholder="Weekends" />
                )
              }}
            />

            <FormControl.HelperText>
              {textsMenu.maxChar}
            </FormControl.HelperText>
            <FormControl.ErrorMessage>{textsMenu.maxChar}</FormControl.ErrorMessage>
          </FormControl>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <Button w={"100px"} variant="ghost" colorScheme="tertiary" onPress={() => {

              setShowModal(false)
            }}>
              {textsMenu.cancel}
            </Button>
            <Button w={"100px"} onPress={() => {
              onMenuSubmit()
              setShowModal(false)
            }}>
              {isEditing ? textsMenu.edit : textsMenu.add}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal >
  )
}
