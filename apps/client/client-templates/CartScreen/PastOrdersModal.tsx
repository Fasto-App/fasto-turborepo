import React from 'react'
import { Heading, Box, FlatList, Button, HStack, Image, Text, } from 'native-base'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { FDSTab, TabsType } from '../../components/FDSTab'
import { texts } from './texts'
import { parseToCurrency } from 'app-helpers'
import { OrderStatus, useGetOrdersBySessionQuery } from '../../gen/generated'
import { LoadingCartItems } from './LoadingTiles'

type PastOrdersModalProps = {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

const states = ["✅", "⏳"];

const PLACEHOLDER_IMAGE = "https://canape.cdnflexcatering.com/themes/frontend/default/images/img-placeholder.png"

// 01. add tab from Business dashboard
const tabs: TabsType = {
  yourOrders: "My Orders",
  tableOrders: "All Orders",
}

export const PastOrdersModal = (props: PastOrdersModalProps) => {
  const { isModalOpen, setIsModalOpen } = props
  const [selectedTab, setSelectedTab] = React.useState("yourOrders");

  const { data, loading, error } = useGetOrdersBySessionQuery()

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
        loading ?
          <LoadingCartItems /> : error ?
            <Text
              flex={1}
              fontSize={"lg"}
              textAlign={"center"}
              alignContent={"center"}
            >{texts.error}</Text> :
            <FlatList
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
              data={data?.getOrdersBySession || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) =>
                <PastOrdersTile
                  key={index}
                  index={index}
                  name={item.product.name}
                  url={item.product.imageUrl || PLACEHOLDER_IMAGE}
                  price={parseToCurrency(item.subTotal)}
                  quantity={item.quantity}
                  orderStatus={item.status}
                  _id={item._id}
                />}
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

type PastOrdersTileProps = {
  index: number;
  name: string;
  price: string;
  url: string;
  quantity: number;
  _id: string;
  orderStatus: OrderStatus;
}

const PastOrdersTile = (props: PastOrdersTileProps) => {
  const { name, index, price, url, quantity, orderStatus } = props;

  return (
    <HStack
      borderRadius={"sm"}
      p={2}
      backgroundColor={index % 2 === 0 ? "primary.100" : "white"}
      justifyContent={"space-between"}
      alignItems={"center"}>
      <HStack space={2}>
        <Box>
          <Image
            size={"xs"}
            source={{ uri: url }}
            alt={""}
            borderRadius={5}
          />
        </Box>
        <Text alignSelf={"center"} w={70}>{name}</Text>
      </HStack>
      <Text>{`x${quantity}`}</Text>
      <Text>{price}</Text>
      <Text fontSize={"18"}>
        {orderStatus === "Pendent" ? states[1] : states[0]}
      </Text>
    </HStack>

  );
};
