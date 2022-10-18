import React, { useState } from 'react'
import { Box, Button, FlatList, FormControl, Heading, HStack, Input, Modal, Pressable, Text } from 'native-base'
import { AddMoreButton } from '../../components/atoms/AddMoreButton';
import { Controller } from 'react-hook-form';
import { useAppStore } from '../UseAppStore';
import { AllAndEditButtons } from '../AllAndAddButons';

const texts = {
  title: "Menu",
  emptyListText: "Start adding Menus by clicking in the button above.",
}

const allMenus = new Array(30).fill({
  name: "Weekends",
  _id: "123"
})

const MenuTile = ({ menu, onPress, selected }) => {
  const color = selected ? "primary.500" : "black"

  return (
    <Pressable onPress={onPress}>
      <Box mr={4} w={200} h={"75px"} borderRadius={'lg'} borderColor={color} borderWidth={"1"} justifyContent={"center"}>
        <Text
          fontSize={"lg"}
          textAlign={'center'}
          color={selected ? "primary.500" : "black"}
        >{menu.name}</Text>
      </Box>
    </Pressable>)
}



export function MenuList({ menuController, onMenuSubmit, menusData }) {
  const [showModal, setShowModal] = useState(false)
  const setMenu = useAppStore(state => state.setMenu)
  const menu = useAppStore(state => state.menu ?? menusData?.[0]?._id)
  const resetEditingAndSectionMap = useAppStore(state => state.resetEditingAndSectionMap)

  const renderMenu = ({ item, index }) => {

    return (
      <MenuTile
        menu={item}
        selected={item._id === menu}
        onPress={() => {
          setMenu(item._id)
          resetEditingAndSectionMap()
        }}
      />)
  }

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
      {/* Left side / Main content */}
      <Box flex={1}>

        {/* Header */}
        <Box flexDirection={"row"} mb={"2"}>
          <Heading flex={1}>
            {texts.title}
          </Heading>
        </Box>

        <Box flexDirection={"row"} width={"100%"} flex={1} mb={2}>

          <Box>
            <AddMoreButton
              widthProps={200}
              horizontal
              onPress={() => setShowModal(true)}
            />
            {menusData.length ?
              <Box paddingTop={"4"}>
                <AllAndEditButtons allAction={undefined} editAction={undefined} categoryId={true} />
              </Box>
              : <Text pt={3} fontSize={"xl"}>{texts.emptyListText}</Text>}
          </Box>
          <HStack flex={1} space={1}>
            <FlatList
              horizontal
              data={menusData}
              renderItem={renderMenu}
              keyExtractor={(item, index) => item._id.toString()}
            />
          </HStack>
        </Box>
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
