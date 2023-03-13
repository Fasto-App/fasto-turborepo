import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, HStack, Image, Pressable, Text } from "native-base";
import { IncrementButtons } from "../OrderSummary/IncrementButtons";
import { Icon } from "../atoms/NavigationButton";

const uri = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80";

export type CartTileProps = {
  index: number;
  name: string;
  price: string;
};

const states = ["🗑", "⏳", "✅"];

const CartTile = (props: CartTileProps) => {
  const { name, index, price } = props;

  return (
    <HStack
      borderRadius={"sm"}
      p={2}
      space={4}
      backgroundColor={index % 2 === 0 ? "primary.100" : "white"}
      justifyContent={"space-between"}
      alignItems={"center"}>
      <HStack space={4}>
        <Box>
          <Image
            size={"xs"}
            source={{ uri: uri }}
            alt={""}
            borderRadius={5}
          />
        </Box>
        <Text alignSelf={"center"} maxW={110}>{name}</Text>
      </HStack>

      <Text>{price}</Text>
      <Box>
        <IncrementButtons
          quantity={1}
          onPlusPress={() => { }}
          onMinusPress={() => { }}
        />
      </Box>
      <Box style={{ flexDirection: "row" }}>
        <Pressable onPress={() => console.log("")}>
          <Icon type={"TrashCan"} />
        </Pressable>
      </Box>
    </HStack>

  );
};

export { CartTile };
