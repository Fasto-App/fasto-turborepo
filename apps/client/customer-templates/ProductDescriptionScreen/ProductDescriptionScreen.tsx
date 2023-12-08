import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Addon } from "../../components/atoms/AddonCheckbox";
import {
  Box,
  Button,
  TextArea,
  Text,
  ScrollView,
  Divider,
  VStack,
  Heading,
  Input,
  FormControl,
  Spinner,
  HStack,
  Pressable,
  Badge,
} from "native-base";
import { useSpring, animated } from "react-spring";
import { PriceTag } from "../../components/molecules/PriceTag";
import { IncrementButtons } from "../../components/OrderSummary/IncrementButtons";
import { MINIMUM_ITEMS_QUANTITY, parseToCurrency } from "app-helpers";
import {
  useAddItemToCartMutation,
  useCreateCustomerAddressMutation,
  useGetGoogleAutocompleteLazyQuery,
  useGetProductByIdQuery,
} from "../../gen/generated";
import { LoadingPDP } from "./LoadingPDP";
import { customerRoute } from "fasto-route";
import { showToast } from "../../components/showToast";
import { useTranslation } from "next-i18next";
import NextImage from "next/image";
import { useGetClientSession } from "../../hooks";
import { ModalAddress } from "../../components/ModalAddress";

const AnimatedBox = animated(Box);

const addons = [
  { _id: "1234", name: "Cheese", price: 250 },
  { _id: "1235", name: "Pickles", price: 450 },
  { _id: "1236", name: "Peperoni", price: 350 },
];

export const ProductDescriptionScreen = () => {
  const route = useRouter();
  const { businessId, productId } = route.query;

  const [isModalAddresOpen, setIsModalOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState("");

  const { data: clientData } = useGetClientSession();
  const { t } = useTranslation("customerProductDescription");

  // function to query product by id
  const { data, loading, error } = useGetProductByIdQuery({
    skip: !productId,
    variables: {
      productId: productId as string,
    },
  });

  const [addItemToCart, { loading: addToCartLoading }] =
    useAddItemToCartMutation({
      onCompleted: () => {
        showToast({
          message: t("addedToCart"),
        });

        route.push({
          pathname: customerRoute["/customer/[businessId]/menu"],
          query: {
            businessId: businessId as string,
          },
        });
      },
      onError: (err) => {
        showToast({
          message: t("errorAddingToCart"),
          subMessage: err.message,
          status: "error",
        });
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

    if (typeof productId !== "string" || !clientData?.getClientSession.tab) {
      throw new Error("Product id is not defined");
    }

    // if client has no address but is a delivery
    if (
      clientData?.getClientSession.tab?.type === "Delivery" &&
      !clientData.getClientSession.user.address
    ) {
      setIsModalOpen(true);
      return;
    }

    addItemToCart({
      variables: {
        input: {
          product: productId,
          quantity,
          notes: text,
        },
      },
    });
  }, [
    productId,
    clientData?.getClientSession.tab,
    clientData?.getClientSession.user.address,
    addItemToCart,
    quantity,
    text,
  ]);

  return (
    <AnimatedBox style={springProps} flex={1}>
      {loading ? (
        <LoadingPDP />
      ) : error ? (
        <Text flex={1} p={8} fontSize={"2xl"} textAlign={"center"}>
          {t("errorPDP")}
        </Text>
      ) : (
        <ScrollView h="100%" px={4}>
          <Box>
            <NextImage
              src={
                data?.getProductByID?.imageUrl ??
                "https://via.placeholder.com/150"
              }
              alt={data?.getProductByID?.name ?? "placeholder"}
              width={"100%"}
              height={"200"}
              objectFit="cover"
              style={{ borderRadius: 5 }}
            />
            <PriceTag price={parseToCurrency(data?.getProductByID?.price)} />
          </Box>
          <Box pt={"4"}>
            <Text fontWeight={"semibold"} fontSize={"25"}>
              {data?.getProductByID?.name}
            </Text>
            {data?.getProductByID?.quantity &&
              data?.getProductByID?.quantity <= MINIMUM_ITEMS_QUANTITY ? (
              <Text alignItems={"left"}>
                <Badge
                  colorScheme={"error"}
                  variant={"solid"}
                >{`${t("lowStock")}: ${data?.getProductByID?.quantity}`}</Badge>
              </Text>
            ) : null}
            <Text pt={"2"}>{data?.getProductByID?.description}</Text>
          </Box>
          <Box pt={"4"}>
            <IncrementButtons
              quantity={quantity}
              onPlusPress={increaseQuantity}
              onMinusPress={decreaseQuantity}
              disabled={!clientData?.getClientSession.tab || addToCartLoading}
              disablePlus={
                !!data?.getProductByID?.quantity &&
                quantity >= data?.getProductByID?.quantity
              }
            />
          </Box>
          <Divider my={"5"} backgroundColor={"gray.300"} />
          {/* TODO */}
          {true ? null : (
            <VStack space={"1"} mb={"4"}>
              <Text fontWeight={"semibold"} fontSize={"25"}>
                {t("extras")}
              </Text>
              {addons.map((addon, index) => (
                <Addon
                  isDisabled={!clientData?.getClientSession.tab}
                  key={index}
                  name={addon.name}
                  price={parseToCurrency(addon.price)}
                  value={addon._id}
                  onChange={() => console.log("Checked")}
                />
              ))}
            </VStack>
          )}
          <TextArea
            h={"32"}
            isDisabled={!clientData?.getClientSession.tab}
            borderWidth={1}
            onChangeText={(text) => setText(text)}
            value={text}
            placeholder="Add a note to your order"
            color="primary"
            autoCompleteType={"none"}
            fontSize={"16"}
          />
        </ScrollView>
      )}
      <Box padding={4}>
        {!clientData ? (
          <Button
            _text={{ fontSize: "18", bold: true }}
            onPress={() =>
              route.push({
                pathname: customerRoute["/customer/[businessId]"],
                query: { businessId: businessId },
              })
            }
          >
            {t("startOrdering")}
          </Button>
        ) : (
          <Button
            isDisabled={!clientData?.getClientSession.tab}
            isLoading={addToCartLoading}
            onPress={onAddToCartPress}
            colorScheme="primary"
            _text={{ fontSize: "18", bold: true }}
          >
            {t("addToCart")}
          </Button>
        )}
      </Box>
      {clientData?.getClientSession.tab?._id ? (
        <ModalAddress
          isOpen={isModalAddresOpen}
          setIsOpen={setIsModalOpen}
          screenName="ProductDescription"
          address={clientData?.getClientSession.user.address}
          selectedType={clientData?.getClientSession.tab?.type}
          tabId={clientData?.getClientSession.tab?._id}
        />
      ) : null}
    </AnimatedBox>
  );
};
