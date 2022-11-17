import React from 'react'
import { VStack } from 'native-base'
import { MenuList } from './MenuList'
import MenuProducts from './MenuProducts'
import { ModalFeedback } from '../../components/ModalFeedback/ModalFeedback'
import { Box } from 'native-base';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMenuMutationHook } from '../../graphQL/MenuQL'

const menuSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name Required" })
    .max(50, { message: "Name too long" }),
});

const MenuScreen = () => {
  const { allMenusByBusiness, createMenu } = useMenuMutationHook();

  const {
    control: menuController,
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(menuSchema),
  });

  const onMenuSubmit = (values) => {
    createMenu({
      variables: {
        input: {
          name: values.name,
        },
      },
    });
  };

  return (
    <Box flex={1}>
      <Box backgroundColor={"primary.500"} h={150} w={"100%"} position={"absolute"} zIndex={-1} />
      <VStack flex={1} m={"4"} space={"4"}>

        <MenuList
          menusData={allMenusByBusiness}
          menuController={menuController}
          onMenuSubmit={handleSubmit(onMenuSubmit)}
        />
        {allMenusByBusiness.length ? <MenuProducts
          menusData={allMenusByBusiness}
        /> : null}
      </VStack>
      <ModalFeedback
        isWarning={false}
        isOpen={false}
        onClose={() => console.log("closing Success")}
      />
    </Box>
  )
}

export { MenuScreen }