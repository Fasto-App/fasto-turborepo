import React, { useState } from 'react'
import { Box, Button, Heading, HStack, Modal, ScrollView, useTheme, VStack } from 'native-base'
import { SmallAddMoreButton } from '../../components/atoms/AddMoreButton';
import { useAppStore } from '../UseAppStore';
import { Tile } from '../../components/Tile';
import { MenuConfig, useMenuHook } from './hooks';
import { ControlledForm } from '../../components/ControlledForm';
import { GetAllMenusByBusinessIdDocument, useCreateMenuMutation, useGetBusinessInformationQuery } from '../../gen/generated';
import { menuSchemaInput } from 'app-helpers';
import { AllMenusbyBusiness } from './types';
import { useTranslation } from 'next-i18next';
import { Icon } from '../../components/atoms/NavigationButton';
import { useRouter } from 'next/router';

export function MenuList({ menusData }: { menusData: AllMenusbyBusiness }) {
  const { t } = useTranslation("businessMenu")
  const { data } = useGetBusinessInformationQuery()

  const [showModal, setShowModal] = useState(false)
  const setMenu = useAppStore(state => state.setMenu)
  const menu = useAppStore(state => state.menu ?? menusData?.[0]?._id)
  const resetEditingAndSectionMap = useAppStore(state => state.resetEditingAndSectionMap)

  const theme = useTheme()
  const router = useRouter()


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
      <Button onPress={() => notifyMe()}>
        Test
      </Button>
      <Box flex={1}>
        <HStack
          flexDirection={"row"} mb={"2"} space={2}>
          <Heading>
            {t("title")}
          </Heading>
        </HStack>
        <VStack space={4}>
          <HStack space={2}>
            <SmallAddMoreButton onPress={() => setShowModal(true)} />
            <ScrollView horizontal={true} pb={2} >
              <HStack space={2}>
                {menusData?.map((item) => (
                  <Box key={item?._id} >
                    {item.isFavorite ? <Box position={"absolute"} >
                      <Icon type={"StarFill"} size={"1em"} />
                    </Box> : null}
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
                  </Box>
                ))}
              </HStack>
            </ScrollView>
          </HStack>
        </VStack>

      </Box>

      <MenuModal
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </Box>
  );
}


const MenuModal = ({ showModal, setShowModal }: {
  showModal: boolean,
  setShowModal: (value: boolean) => void
}) => {
  const { control, handleSubmit, formState } = useMenuHook()

  const { t } = useTranslation("businessMenu")

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
        <Modal.Header>{isEditing ? t("editMenu") : t("addMenu")}</Modal.Header>
        <Modal.Body>
          <ControlledForm
            Config={MenuConfig}
            control={control}
            formState={formState}
          />
        </Modal.Body>
        <Modal.Footer borderColor={"white"}>
          <Button.Group space={2} flex={1} >
            <Button
              w={"100px"}
              variant="outline"
              colorScheme="tertiary"
              onPress={() => setShowModal(false)}
              flex={1}>
              {t("cancel")}
            </Button>
            <Button w={"100px"} onPress={handleSubmit(onMenuSubmit)} flex={1}>
              {isEditing ? t("edit") : t("add")}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal >
  )
}

const title = "Test de Notification Tictle";
const msg = "A message here to test";
const icon = "/images/fasto-logo.png";
const song = "./fasto-sound.wav";

function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support Desktop notifications");
  }
  if (Notification.permission === "granted") {
    callNotify(title, msg, icon);

    return;
  }
  if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        callNotify(title, msg, icon);
      }
    });
    console.log("Test 2")
    return;
  }
}

function callNotify(title: string, msg: string, icone: string) {
  new Notification(title, { body: msg, icon: icone });
  new Audio("/fasto-sound.wav").play();
}
