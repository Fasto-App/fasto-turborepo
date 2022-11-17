import React from 'react'
import { VStack } from 'native-base'
import { MenuList } from './MenuList'
import MenuProducts from './MenuProducts'
import { ModalFeedback } from '../../components/ModalFeedback/ModalFeedback'
import { Box } from 'native-base';

// direct access to API errors and invalid form fields
function MenuScreen({ menuController, onMenuSubmit, menusData }) {
  return (
    <Box flex={1}>
      <Box backgroundColor={"primary.500"} h={150} w={"100%"} position={"absolute"} zIndex={-1} />
      <VStack flex={1} m={"4"} space={"4"}>

        <MenuList
          menusData={menusData}
          menuController={menuController}
          onMenuSubmit={onMenuSubmit}
        />
        {menusData.length > 0 && <MenuProducts
          menusData={menusData}
        />}
      </VStack>
      <ModalFeedback
        isWarning={false}
        isOpen={false}
        onClose={() => console.log("closing Success")}
      />
    </Box>



  )
}

export default MenuScreen