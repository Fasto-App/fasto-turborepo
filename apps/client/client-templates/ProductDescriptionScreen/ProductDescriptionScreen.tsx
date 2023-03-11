import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Addon } from "../../components/atoms/AddonCheckbox";
import { Box, Button, Image, TextArea, Text, ScrollView, Divider, VStack } from "native-base";
import { useSpring, animated } from "react-spring";
import { PriceTag } from "../../components/molecules/PriceTag";
import { IncrementButtons } from "../../components/OrderSummary/IncrementButtons";
import { parseToCurrency } from "app-helpers";
import { texts } from "./texts";

const AnimatedBox = animated(Box);

const addons = [
  { _id: "1234", name: "Cheese", price: 250 },
  { _id: "1235", name: "Pickles", price: 450, },
  { _id: "1236", name: "Peperoni", price: 350 },
]

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
  pricing: [
    {
      price: 2.25,
      currency: "USD",
      priceString: "$2.25",
    },
  ],
  price: 2.25,
};

export const ProductDescriptionScreen = () => {
  const route = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState();
  const isEditMode = route.query?.edit?.toString() === "true";

  const springProps = useSpring({
    to: { opacity: 1, marginTop: 0 },
    from: { opacity: 0, marginTop: 900 },
  });

  const increaseQuantity = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);

  const decreaseQuantity = useCallback(() => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  }, [quantity]);

  const onButtonPress = useCallback(() => {
    console.log("Pressed");

    alert(`Added to cart ${quantity} items`)
  }, [quantity]);


  return (
    <AnimatedBox style={springProps} flex={1}>
      <ScrollView h="100%" px={4}>
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
            onPlusPress={increaseQuantity}
            onMinusPress={decreaseQuantity}
          />
        </Box>
        <Divider my={"3"} backgroundColor={"gray.300"} />
        <VStack space={"1"} mb={"4"}>
          <Text fontWeight={"semibold"} fontSize={"25"}>{texts.extras}</Text>
          {addons.map((addon, index) => (
            <Addon
              key={index}
              name={addon.name}
              price={parseToCurrency(addon.price)}
              value={addon._id}
              onChange={() => console.log("Checked")}
            />
          ))}
        </VStack>
        <TextArea
          borderWidth={1}
          onChange={() => console.log("text")}
          value={text}
          placeholder="Add a note to your order"
          color="primary"
          autoCompleteType={"none"}
          fontSize={"16"}
        />
      </ScrollView>
      <Box padding={4}>
        <Button
          disabled={false}
          onPress={onButtonPress}
          size={"lg"}
          colorScheme="primary"
          _text={{ fontSize: "18", bold: true }}
        >
          {isEditMode ? "Edit" : "Add to cart"}
        </Button>
      </Box>
    </AnimatedBox>
  );
};
