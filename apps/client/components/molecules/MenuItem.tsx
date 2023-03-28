import { parseToCurrency } from "app-helpers";
import { Box, HStack, Text, Image, Pressable } from "native-base";
import React from "react";
import { PriceTag } from "./PriceTag";

type MenuItemProps = {
  name: string;
  price: number;
  uri?: string | null;
  description?: string | null;
  onPress: () => void;
};

const PLACEHOLDER_IMAGE = "https://canape.cdnflexcatering.com/themes/frontend/default/images/img-placeholder.png"

const MenuItem = ({ onPress, name, price, uri, description }: MenuItemProps) => {
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
            textAlign={"justify"}>{description}</Text>
        </Box>
        <Box>
          <Image
            size={"xl"}
            source={{ uri: uri || PLACEHOLDER_IMAGE }}
            alt={""}
            borderRadius={5}
          />
          <PriceTag price={parseToCurrency(price)} />
        </Box>
      </HStack>
    </Pressable>
  );
};

export { MenuItem };
