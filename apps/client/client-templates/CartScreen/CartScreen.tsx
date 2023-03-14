import { parseToCurrency } from "app-helpers";
import { Box, Button, FlatList, Heading, HStack, Text, useTheme } from "native-base";
import React from "react";
import { Icon } from "../../components/atoms/NavigationButton";
import { CartTile } from "../../components/organisms/CartTile";
import { texts } from "./texts";

const orders = new Array(10).fill({
  id: "1",
  status: "pending",
  name: "Pizza de Alho Poro",
  price: 1000,
  uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
});

const renderItem = ({ item, index }: { item: any, index: number }) =>
  <CartTile
    key={index}
    index={index}
    name={item.name}
    price={parseToCurrency(item.price)}
  />

export const CartScreen = () => {

  const theme = useTheme();
  const sendToKitchen = () => {
    console.log("send to kitchen");
  };


  return (
    <Box w={"full"} h={"full"}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        ListHeaderComponent={
          <Box alignItems={"flex-end"} px={2}>
            <Button size="sm" variant="link" colorScheme={"info"}>
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
        <Button _text={{ bold: true }} flex={1} colorScheme={"primary"} onPress={sendToKitchen}>{texts.cta1}</Button>
        <Button _text={{ bold: true }} flex={1} colorScheme={"success"} onPress={sendToKitchen}>{texts.cta2}</Button>
      </HStack>
    </Box>
  );
};
