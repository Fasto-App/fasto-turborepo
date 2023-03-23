import { Box, HStack, Text, Image, Pressable } from "native-base";
import React from "react";
import { PriceTag } from "./PriceTag";

type MenuItemProps = {
  // name: string;
  // ingredients: string;
  // price: number;
  // uri: string;
  onPress: () => void;
};

const name = "Pizza de Calabresa";
const uri = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80";

const formatIngredients = "Lorem ipsum dolor sit amet, sect consectetur adipiscing elit. Emet liu aliquam praesent libero";
const formatPrice = (() => {
  // '(price) => (price / 100).toFixed(2)';
  return "$29.00";
})();

const MenuItem = ({ onPress }: MenuItemProps) => {
  // const { name, ingredients, price, uri } = sectionCellProps;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
    >
      <HStack justifyContent={"space-between"} p={2.5} space={2}>
        <Box flex={1}>
          <Text fontSize={"18"} fontWeight={"500"}>{name}</Text>
          <Text
            fontSize={"15"}
            pt={"1"}
            fontStyle={"italic"}
            color={"gray.500"}
            textAlign={"justify"}>{formatIngredients}</Text>
        </Box>
        <Box>
          <Image
            size={"xl"}
            source={{ uri: uri }}
            alt={""}
            borderRadius={5}
          />
          <PriceTag price={formatPrice} />
        </Box>
      </HStack>
    </Pressable>
  );
};

export { MenuItem };
