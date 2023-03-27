import React, { useState } from 'react'
import { Box, Button, Heading, HStack, Modal, ScrollView, VStack } from 'native-base'
import { SmallAddMoreButton } from '../../components/atoms/AddMoreButton';
import { useAppStore } from '../UseAppStore';
import { Tile } from '../../components/Tile';
import { MenuConfig, useMenuHook } from './hooks';
import { ControlledForm } from '../../components/ControlledForm';
import { GetAllMenusByBusinessIdDocument, useCreateMenuMutation } from '../../gen/generated';
import { menuSchemaInput } from 'app-helpers';
import { AllMenusbyBusiness } from './types';

const texts = {
  title: "Menu",
  emptyListText: "Start adding Menus by clicking in the button above.",
}

export function MenuList({ menusData }: { menusData: AllMenusbyBusiness }) {

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
            <SmallAddMoreButton onPress={() => setShowModal(true)} />
            <ScrollView horizontal={true} pb={2}>
              <HStack space={2}>
                {menusData?.map((item) => (
                  <Tile
                    key={item?._id}
                    selected={item?._id === menu}
                    onPress={() => {
                      setMenu(item?._id)
                      resetEditingAndSectionMap()
                    }}
                  >
                    {item?.name}
                  </Tile>
                ))}
              </HStack>
            </ScrollView>
          </HStack>
          {/* <AllAndEditButtons
            // FIX: should probably only have one button here
            // edit will open the modal to edit the menu name
            allAction={() => console.log("Hello")}
            editAction={() => console.log("Hello")}
            categoryId={"true"}
          /> */}
        </VStack>
      </Box>

      <MenuModal
        setShowModal={setShowModal}
        showModal={showModal}
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

const MenuModal = ({ showModal, setShowModal }: {
  showModal: boolean,
  setShowModal: (value: boolean) => void
}) => {
  const { control, handleSubmit, formState } = useMenuHook()

  const [createMenu] = useCreateMenuMutation({
    update: (cache, { data }) => {
      // @ts-ignore
      const { getAllMenusByBusinessID } = cache.readQuery({
        query: GetAllMenusByBusinessIdDocument
      });

      cache.writeQuery({
        query: GetAllMenusByBusinessIdDocument,
        data: {
          getAllMenusByBusinessID: [data?.createMenu, ...getAllMenusByBusinessID]
        }
      });
    }
  });


  const onMenuSubmit = (values: menuSchemaInput) => {
    createMenu({
      variables: {
        input: {
          name: values.name,
        },
      },
    });

    setShowModal(false)
  };

  // TODO
  const isEditing = false

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="40%" minW={"400px"}>
        <Modal.CloseButton />
        <Modal.Header>{isEditing ? textsMenu.editMenu : textsMenu.addMenu}</Modal.Header>
        <Modal.Body>
          <ControlledForm
            Config={MenuConfig}
            control={control}
            formState={formState}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              w={"100px"}
              variant="ghost"
              colorScheme="tertiary"
              onPress={() => setShowModal(false)}>
              {textsMenu.cancel}
            </Button>
            <Button w={"100px"} onPress={handleSubmit(onMenuSubmit)}>
              {isEditing ? textsMenu.edit : textsMenu.add}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal >
  )
}
