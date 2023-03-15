import { parseToCurrency, typedKeys } from "app-helpers";
import { Box, Button, FlatList, Heading, HStack, Text, useTheme } from "native-base";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Icon } from "../../components/atoms/NavigationButton";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { FDSTab, TabsType } from "../../components/FDSTab";
import { CartTile, PastOrdersTile } from "../../components/organisms/CartTile";
import { clientRoute } from "../../routes";
import { texts } from "./texts";

const orders = new Array(10).fill({
  id: "1",
  status: "pending",
  name: "Pizza de Alho Poro",
  price: 1000,
  uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
});

// 01. add tab from Business dashboard
const tabs: TabsType = {
  yourOrders: "Your Orders",
  tableOrders: "Past Orders",
}

const renderCartItem = ({ item, index }: { item: any, index: number }) =>
  <CartTile
    key={index}
    index={index}
    name={item.name}
    price={parseToCurrency(item.price)}
  />

const renderPastOrderItem = ({ item, index }: { item: any, index: number }) =>
  <PastOrdersTile
    key={index}
    index={index}
    name={item.name}
    price={parseToCurrency(item.price)}
  />

export const CartScreen = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("yourOrders");
  const route = useRouter();

  const theme = useTheme();

  const placeOrder = () => {
    console.log("send to kitchen");
  };

  const payBill = useCallback(() => {
    console.log("pay bill");
    route.push(clientRoute.checkout);
  }, [route]);


  return (
    <Box w={"full"} h={"full"}>
      <FlatList
        data={orders}
        renderItem={renderCartItem}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        ListHeaderComponent={
          <Box alignItems={"flex-end"} px={2}>
            <Button
              size="sm"
              variant="link"
              colorScheme={"info"}
              onPress={() => setIsModalOpen(true)}>
              {texts.seePastOrders}
            </Button>
          </Box>

        }
        ListEmptyComponent={
          <Box>
            <Text justifyContent={"center"} alignItems={"flex-end"} pt={"8"} textAlign={"center"}>
              <Text fontSize={"18"}>{texts.yourCartIsEmpty}</Text>
              <Box px={"2"}>
                <Icon type="ListStar" color={theme.colors.primary["500"]} size={"2em"} />
              </Box>
              <Text fontSize={"18"}>{texts.andStartOrdering}</Text>
            </Text>
          </Box>
        }
      />
      <HStack space={"4"} p={4} backgroundColor={"rgba(187, 5, 5, 0)"}>
        <Button _text={{ bold: true }} flex={1} colorScheme={"primary"} onPress={placeOrder}>{texts.cta1}</Button>
        <Button _text={{ bold: true }} flex={1} colorScheme={"success"} onPress={payBill}>{texts.cta2}</Button>
      </HStack>
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
            renderItem={renderPastOrderItem}
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
    </Box>
  );
};
