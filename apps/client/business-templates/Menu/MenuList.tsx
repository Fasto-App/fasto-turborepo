import React, { useState } from 'react'
import { Box, Heading, HStack, Modal, ScrollView, VStack } from 'native-base'
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
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@/shadcn/components/ui/button';

export function MenuList({ menusData }: { menusData: AllMenusbyBusiness }) {
  const { t } = useTranslation("businessMenu")
  const [showModal, setShowModal] = useState(false)
  const setMenu = useAppStore(state => state.setMenu)
  const menu = useAppStore(state => state.menu ?? menusData?.[0]?._id)
  const resetEditingAndSectionMap = useAppStore(state => state.resetEditingAndSectionMap)


  return (
    <div className='p-4 shadow-md border rounded-md border-gray-400 bg-white flex flex-row mt-[20px] sm:mt-0'
    >
      <div className='flex-1'>
        <div className='flex flex-row mb-2 space-x-2'>
          <a className='text-xl font-bold'>
            {t("title")}
          </a>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className=' border border-primary-700 shadow-md' onClick={() => {
            setShowModal(true)
          }}>
            <PlusIcon className='m-0 p-0' />
          </Button>
          <ScrollView horizontal={true} p={1} >
            <div className="flex space-x-2">
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
            </div>
          </ScrollView>
        </div>
      </div>

      <MenuModal
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </div>
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
          <div className="flex flex-1 space-x-2">
            <Button
              className="w-24 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md py-2 px-4 flex-1"
              onClick={() => setShowModal(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              className="w-24 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 flex-1"
              onClick={handleSubmit(onMenuSubmit)}
            >
              {isEditing ? t("edit") : t("add")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal >
  )
}

