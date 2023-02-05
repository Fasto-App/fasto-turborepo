import React from 'react'
import { VStack } from 'native-base'
import { MenuList } from './MenuList'
import MenuProducts from './MenuProducts'
import { ModalFeedback } from '../../components/ModalFeedback/ModalFeedback'
import { Box } from 'native-base';
import { useGetAllMenusByBusinessIdQuery } from '../../gen/generated'

const MenuScreen = () => {
  const { data } = useGetAllMenusByBusinessIdQuery();

  return (
    <Box flex={1}>
      <Box
        backgroundColor={"primary.500"}
        h={150}
        w={"100%"}
        position={"absolute"}
        zIndex={-1}
      />
      <VStack flex={1} m={"4"} space={"4"}>
        <MenuList menusData={data?.getAllMenusByBusinessID ?? []} />
        {data?.getAllMenusByBusinessID ? (
          <MenuProducts
            menusData={data?.getAllMenusByBusinessID}
          />
        ) : null}
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