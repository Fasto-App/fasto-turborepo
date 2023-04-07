import React from 'react'
import { Heading, Box, FlatList, Button } from 'native-base'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { FDSTab, TabsType } from '../../components/FDSTab'
import { texts } from './texts'
import { parseToCurrency } from 'app-helpers'
import { CartTileProps, PastOrdersTile } from '../../components/organisms/CartTile'

type PastOrdersModalProps = {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

const orders = new Array(10).fill({
  _id: "1",
  status: "pending",
  name: "Pizza de Alho Poro",
  price: "$400",
  uri: "https://canape.cdnflexcatering.com/themes/frontend/default/images/img-placeholder.png",
  quantity: 4,
}) as CartTileProps[];

// 01. add tab from Business dashboard
const tabs: TabsType = {
  yourOrders: "Your Orders",
  tableOrders: "Past Orders",
}

const renderPastOrderItem = ({ item, index }: { item: CartTileProps, index: number }) =>
  <PastOrdersTile
    key={index}
    index={index}
    name={item.name}
    url=""
    price={item.price}
    quantity={item.quantity}
    _id={item._id}
  />

export const PastOrdersModal = (props: PastOrdersModalProps) => {
  const { isModalOpen, setIsModalOpen } = props
  const [selectedTab, setSelectedTab] = React.useState("yourOrders");

  return (
    <CustomModal
      isOpen={isModalOpen}
      size={"full"}
      onClose={() => setIsModalOpen(false)}
      HeaderComponent={
        <Heading textAlign={"center"} size={"md"}>
          {texts.modalTitle}
        </Heading>}
      ModalBody={
        <FlatList
          data={orders}
          renderItem={renderPastOrderItem}
          ListHeaderComponent={
            <>
              <FDSTab
                tabs={tabs}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
              <Box h={"2"} />
            </>
          }
        />
      }
      ModalFooter={
        <Button
          w={"full"}
          colorScheme={"primary"}
          onPress={() => setIsModalOpen(false)}
        >
          {texts.modalCta1}
        </Button>}
    />
  )
}
