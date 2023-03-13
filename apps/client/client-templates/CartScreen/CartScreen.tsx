import { Box, Button, FlatList, Heading, Text, useTheme, VStack } from "native-base";
import React from "react";
import { Icon } from "../../components/atoms/NavigationButton";
import { CartTile } from "../../components/organisms/CartTile";
import { texts } from "./texts";

const orders = new Array(10).fill({
  id: "1",
  status: "pending",
});

const renderItem = ({ item, index }: any) =>
  <CartTile
    key={index}
    index={index}
    order={item}
    refetch={() => undefined}
  />

export const CartScreen = () => {

  const theme = useTheme();
  const sendToKitchen = () => {
    console.log("send to kitchen");
  };


  return (
    <Box w={"full"} h={"full"}>
      <Heading textAlign={"center"}>{texts.title}</Heading>
      <FlatList
        data={orders}
        renderItem={renderItem}
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
      <VStack space={"4"} p={"4"}>
        <Button colorScheme={"tertiary"} onPress={sendToKitchen}>{texts.seePastOrders}</Button>
        <Button colorScheme={"secondary"} onPress={sendToKitchen}>{texts.sendToKitchen}</Button>
      </VStack>
    </Box>
  );
};
