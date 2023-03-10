import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  StyleSheet
} from "react-native";
import { AddonCheckbox } from "../../components/atoms/AddonCheckbox";
import { Box, Button, Image, Pressable, TextArea, Text, ScrollView, Spacer, Divider } from "native-base";
import { useSpring, animated } from "react-spring";
import { PriceTag } from "../../components/molecules/PriceTag";
import { IncrementButtons } from "../../components/OrderSummary/IncrementButtons";
import { D } from "chart.js/dist/chunks/helpers.core";

const AnimatedBox = animated(Box);

const item = {
  restaurant_id: 3456789876543,
  id: Math.floor(Math.random() * 999999),
  status: "pending",
  customer_id: null,
  uri:
    "https://assets.bonappetit.com/photos/597f6564e85ce178131a6475/master/w_1200,c_limit/0817-murray-mancini-dried-tomato-pie.jpg",
  name: "Regular Coffee",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  quantity: 1,
  subtotal: 1.5,
  addons: [
    { name: "Cheese", price: "$2,50", selected: false },
    {
      name: "Pickles",
      price: "$4,50",
    },
    {
      name: "Peperoni",
      price: "$3,50",
    },
  ],
  pricing: [
    {
      price: 2.25,
      currency: "USD",
      priceString: "$2.25",
    },
  ],
  price: 2.25,
};

type HeaderProps = {
  quantity: number;
  setQuantity: (quantity: number) => void;
  item: typeof item;
};

const HeaderList = ({ quantity, setQuantity, item }: HeaderProps) => {
  return (
    <Box>
      <Box>
        <Image
          w={"100%"}
          h={"200"}
          maxW={"425"}
          alt="logo"
          source={{ uri: item.uri }}
          borderRadius={5}
        />
        <PriceTag price={"$12.34"} />
      </Box>
      <Box pt={"4"}>
        <Text fontWeight={"semibold"} fontSize={"25"}>{item.name}</Text>
        <Text pt={"2"}>{item.description}</Text>
      </Box>
      <Box pt={"4"}>
        <IncrementButtons
          quantity={quantity}
          onPlusPress={() => setQuantity}
          onMinusPress={() => setQuantity}
        />
      </Box>
    </Box>
  );
};

export const ProductDescriptionScreen = () => {
  const route = useRouter();
  const [isBrowser, setIsBrowser] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState();
  const [items, setItems] = useState([item?.addons]);
  const isEditMode = route.query?.edit?.toString() === "true";

  const _editItemOnPress = async () => {
    try {
      alert("We are adding your oder");
      // refetch();
      route.back();
    } catch {

      alert("ERROR");
    }
  };

  // handle functions
  const _addToCartOnPress = async () => {

  };

  const _onChangeText = () => {

  };

  const [flip, set] = React.useState(false);
  const springProps = useSpring({
    to: { opacity: 1, marginTop: 0 },
    from: { opacity: 0, marginTop: 900 },
  });

  const _onPress = () =>
    isEditMode ? _editItemOnPress() : _addToCartOnPress();

  // todo animate scrollview
  return (
    <AnimatedBox style={springProps} flex={1}>
      <ScrollView h="100%" px={2}>
        <HeaderList
          quantity={quantity}
          setQuantity={setQuantity}
          item={item}
        />
        <Divider my={"4"} backgroundColor={"gray.300"} />
        <Box>
          {items.length &&
            items.map((item, index) => (
              <AddonCheckbox
                key={index}
                item={item}
                setItems={setItems}
                position={index}
              />
            ))}
        </Box>
        <TextArea
          onChange={_onChangeText}
          value={text}
          placeholder="Add a note to your order"
          color="primary" autoCompleteType={""}
        />

      </ScrollView>
      <Box padding={4}>
        <Button
          disabled={false}
          onPress={_onPress}
          size={"lg"}
          colorScheme="secondary"
        >
          {isEditMode ? "Edit" : "Add to cart"}
        </Button>
      </Box>
    </AnimatedBox>
  );
};
