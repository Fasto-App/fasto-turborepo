import React, { useMemo } from 'react'
import { Heading, Box, FlatList, Button, HStack, Image, Text, Divider, Pressable, } from 'native-base'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { FDSTab, TabsType } from '../../components/FDSTab'
// import { texts } from './texts'
import { parseToCurrency, typedKeys } from 'app-helpers'
import { OrderStatus, useGetOrdersBySessionQuery } from '../../gen/generated'
import { LoadingCartItems } from './LoadingTiles'
import { useGetClientSession } from '../../hooks'
import { useTranslation } from 'next-i18next'

type PastOrdersModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const states = ["✅", "⏳"];

const PLACEHOLDER_IMAGE = "https://canape.cdnflexcatering.com/themes/frontend/default/images/img-placeholder.png"

const tabs = {
  yourOrders: "My Orders",
  tableOrders: "All Orders",
} as const

export const PastOrdersList = () => {
  const [selectedTab, setSelectedTab] = React.useState<keyof typeof tabs>("yourOrders");

  const { t } = useTranslation('common')
  const { data: clientSession } = useGetClientSession()
  const { data, loading, error } = useGetOrdersBySessionQuery()

  const myOrders = useMemo(() => data?.getOrdersBySession.filter((item) => item?.user === clientSession?.getClientSession?.user?._id), [clientSession?.getClientSession?.user?._id, data?.getOrdersBySession])

  return (
    <>
      {loading ?
        <LoadingCartItems /> : error ?
          <Text
            flex={1}
            fontSize={"lg"}
            textAlign={"center"}
            alignContent={"center"}
          >{t("somethingWentWrong")}</Text> :
          <FlatList
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <Box>
                <HStack justifyContent={"space-around"} backgroundColor={"white"}>
                  {typedKeys(tabs).map((key) => {
                    return (
                      <Pressable key={key} flex={1} onPress={() => setSelectedTab(key)}>
                        <Heading
                          size={"sm"}
                          textAlign={"center"}
                          color={selectedTab === key ? "primary.500" : "gray.400"}
                          pb={2}
                        >
                          {`${tabs[key]} (${key === "yourOrders" ?
                            myOrders?.length ?? 0
                            : data?.getOrdersBySession?.length ?? 0})`}
                        </Heading>
                      </Pressable>
                    )
                  })}
                </HStack>
                <Divider bg={"gray.300"} />
                <Box h={"2"} />
              </Box>
            }
            data={selectedTab === "yourOrders" ? myOrders : data?.getOrdersBySession}
            keyExtractor={(item, index) => item._id + index}
            renderItem={({ item, index }) =>
              <PastOrdersTile
                index={index}
                name={item.product.name}
                url={item.product.imageUrl || PLACEHOLDER_IMAGE}
                price={parseToCurrency(item.subTotal)}
                quantity={item.quantity}
                orderStatus={item.status}
                _id={item._id}
              />
            }
          />}
    </>
  )
}

export const PastOrdersModal = (props: PastOrdersModalProps) => {
  const { isModalOpen, setIsModalOpen } = props
  const [selectedTab, setSelectedTab] = React.useState<keyof typeof tabs>("yourOrders");

  const { t } = useTranslation('common')
  const { data: clientSession } = useGetClientSession()
  const { data, loading, error } = useGetOrdersBySessionQuery({
    skip: !isModalOpen,
  })

  const myOrders = useMemo(() => data?.getOrdersBySession.filter((item) => item?.user === clientSession?.getClientSession?.user?._id), [clientSession?.getClientSession?.user?._id, data?.getOrdersBySession])

  return (
    <CustomModal
      isOpen={isModalOpen}
      size={"full"}
      onClose={() => setIsModalOpen(false)}
      HeaderComponent={
        <Heading textAlign={"center"} size={"md"}>
          {t("placedOrders")}
        </Heading>}
      ModalBody={
        loading ?
          <LoadingCartItems /> : error ?
            <Text
              flex={1}
              fontSize={"lg"}
              textAlign={"center"}
              alignContent={"center"}
            >{t("somethingWentWrong")}</Text> :
            <FlatList
              ListHeaderComponent={
                <Box>
                  <HStack justifyContent={"space-around"}>
                    {typedKeys(tabs).map((key) => {
                      return (
                        <Pressable key={key} flex={1} onPress={() => setSelectedTab(key)}>
                          <Heading
                            size={"sm"}
                            textAlign={"center"}
                            color={selectedTab === key ? "primary.500" : "gray.400"}
                            pb={2}
                          >
                            {`${tabs[key]} (${key === "yourOrders" ?
                              myOrders?.length ?? 0
                              : data?.getOrdersBySession?.length ?? 0})`}
                          </Heading>
                        </Pressable>
                      )
                    })}
                  </HStack>
                  <Divider bg={"gray.300"} />
                  <Box h={"2"} />
                </Box>
              }
              data={selectedTab === "yourOrders" ? myOrders : data?.getOrdersBySession}
              keyExtractor={(item, index) => item._id + index}
              renderItem={({ item, index }) =>
                <PastOrdersTile
                  index={index}
                  name={item.product.name}
                  url={item.product.imageUrl || PLACEHOLDER_IMAGE}
                  price={parseToCurrency(item.subTotal)}
                  quantity={item.quantity}
                  orderStatus={item.status}
                  _id={item._id}
                />
              }
            />
      }
      ModalFooter={
        <Button
          w={"full"}
          colorScheme={"primary"}
          onPress={() => setIsModalOpen(false)}
        >
          {t("back")}
        </Button>
      }
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
