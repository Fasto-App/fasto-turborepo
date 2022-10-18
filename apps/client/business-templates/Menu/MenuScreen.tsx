import React from 'react'
import { VStack } from 'native-base'
import { MenuList } from './MenuList'
import MenuProducts from './MenuProducts'
import { ModalFeedback } from '../../components/ModalFeedback/ModalFeedback'

// direct access to API errors and invalid form fields
function MenuScreen({ menuController, onMenuSubmit, menusData }) {
  return (
    <VStack flex={1} m={"4"} space={"4"}>
      <MenuList
        menusData={menusData}
        menuController={menuController}
        onMenuSubmit={onMenuSubmit}
      />
      {menusData.length > 0 && <MenuProducts
        menusData={menusData}
      />}

      <ModalFeedback
        isWarning={false}
        isOpen={false}
        onClose={() => console.log("closing Success")}
      />
    </VStack>
  )
}

export default MenuScreen