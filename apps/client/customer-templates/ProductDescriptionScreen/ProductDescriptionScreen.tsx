import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Addon } from "../../components/atoms/AddonCheckbox";
import { Box, Button, Image, TextArea, Text, ScrollView, Divider, VStack } from "native-base";
import { useSpring, animated } from "react-spring";
import { PriceTag } from "../../components/molecules/PriceTag";
import { IncrementButtons } from "../../components/OrderSummary/IncrementButtons";
import { PRODUCT_PLACEHOLDER_IMAGE, parseToCurrency } from "app-helpers";
import { getClientCookies } from "../../cookies";
import { useAddItemToCartMutation, useGetProductByIdQuery } from "../../gen/generated";
import { LoadingPDP } from "./LoadingPDP";
import { customerRoute } from "../../routes";
import { showToast } from "../../components/showToast";
import { useTranslation } from "next-i18next";

const AnimatedBox = animated(Box);

const addons = [
  { _id: "1234", name: "Cheese", price: 250 },
  { _id: "1235", name: "Pickles", price: 450, },
  { _id: "1236", name: "Peperoni", price: 350 },
]

export const ProductDescriptionScreen = () => {
  const route = useRouter();
  const { businessId, productId } = route.query;

  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState("");

  const tab = getClientCookies(businessId as string)
  const { t } = useTranslation("customerProductDescription");

  // function to query product by id
  const { data, loading, error } = useGetProductByIdQuery({
    skip: !productId,
    variables: {
      productId: productId as string,
    }
  })

  const [addItemToCart, { loading: addToCartLoading }] = useAddItemToCartMutation({
    onCompleted: () => {
      showToast({
        message: t("addedToCart"),
      })

      route.push(customerRoute.menu(businessId as string));
    },
    onError: (err) => {
      showToast({
        message: t("errorAddingToCart"),
        subMessage: err.message,
        status: "error"
      })
    },
  });

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

  const onAddToCartPress = useCallback(() => {
    console.log("Pressed");

    if (typeof productId !== "string" || typeof tab !== "string") {
      throw new Error("Product id is not defined")
    };

    addItemToCart({
      variables: {
        input: {
          product: productId,
          quantity,
          notes: text,
        }
      }
    })


  }, [addItemToCart, productId, quantity, tab, text]);


  return (
    <AnimatedBox style={springProps} flex={1}>
      {loading ? <LoadingPDP /> : error ? (
        <Text
          flex={1}
          p={8}
          fontSize={"2xl"}
          textAlign={"center"}>{t("errorPDP")}</Text>
      ) :
        <ScrollView h="100%" px={4}>
          <Box>
            {/* TODO: add aspect ration */}
            <Image
              w={"100%"}
              h={"200"}
              alt="logo"
              resizeMode="cover"
              source={{ uri: data?.getProductByID?.imageUrl || PRODUCT_PLACEHOLDER_IMAGE }}
              borderRadius={5}
            />
            <PriceTag price={parseToCurrency(data?.getProductByID?.price)} />
          </Box>
          <Box pt={"4"}>
            <Text fontWeight={"semibold"} fontSize={"25"}>{data?.getProductByID?.name}</Text>
            <Text pt={"2"}>{data?.getProductByID?.description}</Text>
          </Box>
          <Box pt={"4"}>
            <IncrementButtons
              quantity={quantity}
              onPlusPress={increaseQuantity}
              onMinusPress={decreaseQuantity}
              disabled={!tab || addToCartLoading}
            />
          </Box>
          <Divider my={"5"} backgroundColor={"gray.300"} />
          {/* TODO */}
          {true ? null : <VStack space={"1"} mb={"4"}>
            <Text fontWeight={"semibold"} fontSize={"25"}>{t("extras")}</Text>
            {addons.map((addon, index) => (
              <Addon
                isDisabled={!tab}
                key={index}
                name={addon.name}
                price={parseToCurrency(addon.price)}
                value={addon._id}
                onChange={() => console.log("Checked")}
              />
            ))}
          </VStack>}
          <TextArea
            h={"32"}
            isDisabled={!tab}
            borderWidth={1}
            onChangeText={(text) => setText(text)}
            value={text}
            placeholder="Add a note to your order"
            color="primary"
            autoCompleteType={"none"}
            fontSize={"16"}
          />
        </ScrollView>
      }
      <Box padding={4}>
        <Button
          isDisabled={!tab}
          isLoading={addToCartLoading}
          onPress={onAddToCartPress}
          size={"lg"}
          colorScheme="primary"
          _text={{ fontSize: "18", bold: true }}
        >
          {t("addToCart")}
        </Button>
      </Box>
    </AnimatedBox>
  );
};

