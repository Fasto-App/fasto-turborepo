import React, { useCallback } from "react";
import { parseToCurrency, typedKeys } from "app-helpers";
import { Box, Button, Divider, FlatList, HStack, SectionList, Skeleton, Text, useTheme } from "native-base";
import { useRouter } from "next/router";
import { Icon } from "../../components/atoms/NavigationButton";
import { CartTile } from "../../components/organisms/CartTile";
import { clientRoute } from "../../routes";
import { texts } from "./texts";
import { useGetCartItemsPerTabQuery } from "../../gen/generated";
import { getClientCookies } from "../../cookies";
import { PastOrdersModal } from "./PastOrdersModal";

const IMAGE_PLACEHOLDER = "https://canape.cdnflexcatering.com/themes/frontend/default/images/img-placeholder.png";

export const CartScreen = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const route = useRouter();
  const { businessId, checkoutId } = route.query;

  const token = getClientCookies(businessId as string)

  const { data, loading, error } = useGetCartItemsPerTabQuery({
    skip: !token,
    pollInterval: 10000,
    fetchPolicy: "network-only"
  })

  const theme = useTheme();

  const placeOrder = () => {
    console.log("send to kitchen");
  };

  const payBill = useCallback(() => {
    if (typeof businessId !== "string" || typeof checkoutId !== "string") return;

    route.push(clientRoute.checkout(businessId, checkoutId));
  }, [businessId, checkoutId, route]);

  const groupedData = data?.getCartItemsPerTab.reduce((acc, item) => {
    const user = item.user;

    if (acc[user?._id]) {
      acc[user._id] = [...acc[user._id], item]
    } else {
      acc[user._id] = [item];
    }

    return acc;

  }, {} as { [key: string]: any[] });

  const transformedData = typedKeys(groupedData).map((key) => {
    return {
      title: key,
      data: groupedData?.[key] as any[]
    }
  })

  console.log("transformedData", transformedData);


  return (
    <>
      <Box flex={1}>
        {loading ?
          <LoadingCartItems /> : error ?
            <Text
              flex={1}
              fontSize={"lg"}
              textAlign={"center"}
              alignContent={"center"}
            >{texts.error}</Text> :
            <SectionList
              sections={transformedData || []}
              renderSectionHeader={({ section: { title } }) => (
                <Box px={4} backgroundColor={"white"}>
                  <Text fontSize={"22"} fontWeight={"500"}>{title}</Text>
                </Box>
              )}
              renderItem={({ item, index }) =>
                <CartTile
                  _id={item._id}
                  key={item._id}
                  index={index}
                  name={item.product.name}
                  url={item.product.imageUrl || IMAGE_PLACEHOLDER}
                  price={parseToCurrency(item.subTotal)}
                  quantity={item.quantity}
                />}
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
        }
      </Box>
      <PastOrdersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen} />
      <HStack space={"4"} p={4} backgroundColor={"rgba(187, 5, 5, 0)"}>
        <Button
          flex={1}
          isLoading={loading}
          _text={{ bold: true }}
          colorScheme={"primary"}
          onPress={placeOrder}>{texts.cta1}</Button>
        <Button
          isLoading={loading}
          _text={{ bold: true }}
          flex={1}
          colorScheme={"tertiary"}
          onPress={payBill}>{texts.cta2}</Button>
      </HStack>
    </>
  );
};

const LoadingCartItems = () => {
  return (
    <Box>
      {new Array(6).fill({}).map((_, i) => (
        <Skeleton
          key={i}
          p={1}
          borderRadius={"md"}
          startColor={i % 2 === 0 ? "secondary.200" : "gray.200"} />
      )
      )}
    </Box>
  )
}
