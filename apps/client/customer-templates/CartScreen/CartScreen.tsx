import React, { useCallback, useMemo } from "react";
import { PRODUCT_PLACEHOLDER_IMAGE, parseToCurrency, typedKeys } from "app-helpers";
import { Box, Button, HStack, SectionList, Skeleton, Text, useTheme } from "native-base";
import { useRouter } from "next/router";
import { Icon } from "../../components/atoms/NavigationButton";
import { CartTile } from "../../components/organisms/CartTile";
import { customerRoute } from "../../routes";
import { GetCartItemsPerTabDocument, useClientCreateMultipleOrderDetailsMutation, useGetCartItemsPerTabQuery, useRequestCloseTabMutation } from "../../gen/generated";
import { getClientCookies } from "../../cookies";
import { PastOrdersModal } from "./PastOrdersModal";
import { useGetClientSession } from "../../hooks";
import { showToast } from "../../components/showToast";
import { LoadingCartItems } from "./LoadingTiles";
import { getCause } from "../../apollo-client/ErrorLink";
import { useTranslation } from "next-i18next";

export const CartScreen = () => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const route = useRouter();
  const { businessId, checkoutId } = route.query;

  const token = getClientCookies(businessId as string)

  const { t } = useTranslation("customerCart");

  const { data: clientSession } = useGetClientSession()

  const { data, loading, error } = useGetCartItemsPerTabQuery({
    skip: !token,
    pollInterval: 1000 * 60, // 1 minute
    fetchPolicy: "network-only"
  })

  const isAdmin = !!clientSession?.getClientSession.user._id && !!clientSession?.getClientSession?.tab?.admin && clientSession?.getClientSession?.tab?.admin === clientSession?.getClientSession.user._id

  const [createOrder, { loading: loadingCreateOrder }] =
    useClientCreateMultipleOrderDetailsMutation({
      refetchQueries: [{ query: GetCartItemsPerTabDocument }],
      onCompleted: () => {
        showToast({ message: "Order placed successfully" });
      },
      onError: (error) => {
        showToast({
          message: "Error placing order",
          subMessage: getCause(error),
          status: "error"
        });
      },
    })

  const [closeTab, { loading: closeTabLoading }] = useRequestCloseTabMutation({
    onCompleted: (data) => {
      if (data?.requestCloseTab.checkout) {
        showToast({ message: "Tab closed successfully" });

        route.push(customerRoute.checkout(businessId as string, data?.requestCloseTab.checkout))
      }

    },
    onError: (error) => {
      showToast({
        message: "Error closing tab",
        subMessage: getCause(error),
        status: "error"
      });
    },
  })

  const placeOrder = () => {
    console.log("Place Order");

    const mappedOrders = data?.getCartItemsPerTab.map((item) => {
      return {
        cartItem: item._id,
        quantity: item.quantity,
        user: item.user._id,
      }
    })

    if (!mappedOrders) return;

    createOrder({
      variables: {
        input: mappedOrders
      }
    })
  };

  const payBill = useCallback(() => {
    console.log("Pay Bill")
    closeTab()

  }, [closeTab]);

  const groupedData = useMemo(() => {
    return data?.getCartItemsPerTab.reduce((acc, item) => {
      const user = item.user;
      const name = user._id === clientSession?.getClientSession.user._id ? t("me") : user.name;

      if (acc[user._id]) {
        acc[user._id].data.push(item);
        acc[user._id].name = name;
      } else {
        acc[user._id] = {
          name,
          data: [item],
        }
      }

      return acc;
    }, {} as { [key: string]: { name?: string | null, data: any[], } });
  }, [clientSession?.getClientSession.user._id, data?.getCartItemsPerTab, t])

  const sortedData = useMemo(() => {
    return typedKeys(groupedData).sort((a, b) => {
      if (a === clientSession?.getClientSession.user._id) return -1;
      if (b === clientSession?.getClientSession.user._id) return 1;
      return 0;
    })
  }, [clientSession?.getClientSession.user._id, groupedData])

  const transformedData = useMemo(() => {
    return sortedData.map((key, i) => {
      return {
        title: groupedData?.[key].name || `Guest ${++i}`,
        data: groupedData?.[key].data as any[]
      }
    })
  }, [groupedData, sortedData])

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
            >{t("error")}</Text> :
            <SectionList
              keyExtractor={(item) => item._id}
              ListHeaderComponent={
                <Box alignItems={"flex-end"} px={2}>
                  {!clientSession?.getClientSession.tab?.orders?.length ? null : <Button
                    size="sm"
                    variant="link"
                    colorScheme={"info"}
                    _text={{ fontSize: "lg" }}
                    onPress={() => setIsModalOpen(true)}>
                    {t("placedOrders", { number: clientSession?.getClientSession.tab?.orders?.length })}
                  </Button>}
                </Box>
              }
              sections={transformedData || []}
              renderSectionHeader={({ section: { title } }) => (
                <HStack
                  pt={title === t("me") ? "0" : "4"}
                  px={4} pb={2}
                  space={2} backgroundColor={"white"}>
                  <Text alignSelf={"center"} fontSize={"18"} fontWeight={"500"}>{title}</Text>
                </HStack>
              )}
              renderItem={({ item, index }) =>
                <CartTile
                  _id={item._id}
                  key={item._id}
                  index={index}
                  name={item.product.name}
                  url={item.product.imageUrl || PRODUCT_PLACEHOLDER_IMAGE}
                  price={parseToCurrency(item.subTotal)}
                  quantity={item.quantity}
                  editable={item.user._id === clientSession?.getClientSession.user._id}
                  navegateTo={() => {
                    route.push(customerRoute.production_description(businessId as string, item.product._id))
                  }}
                />}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              ListEmptyComponent={
                <Box>
                  <Text justifyContent={"center"} alignItems={"flex-end"} pt={"8"} textAlign={"center"}>
                    <Text key={t("yourCartIsEmpty")} fontSize={"18"}>{t("yourCartIsEmpty")}</Text>
                    <Box key={"Listar"} px={"2"}>
                      <Icon type="ListStar" color={theme.colors.primary["500"]} size={"2em"} />
                    </Box>
                    <Text key={t("andStartOrdering")} fontSize={"18"}>{t("andStartOrdering")}</Text>
                  </Text>
                </Box>
              }
            />
        }
      </Box>
      <PastOrdersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen} />
      {!isAdmin ? <Box backgroundColor={"white"} p='4' textAlign={"center"}>
        {t("askToAdmin")}
      </Box> : <HStack space={"4"} p={4} backgroundColor={"rgba(187, 5, 5, 0)"}>
        <Button
          flex={1}
          isDisabled={!data?.getCartItemsPerTab || data?.getCartItemsPerTab.length === 0}
          isLoading={loading || loadingCreateOrder || closeTabLoading}
          _text={{ bold: true }}
          colorScheme={"primary"}
          onPress={placeOrder}>{t("cta1")}</Button>
        <Button
          isLoading={loading || loadingCreateOrder || closeTabLoading}
          _text={{ bold: true }}
          flex={1}
          colorScheme={"tertiary"}
          onPress={payBill}>{t("cta2")}</Button>
      </HStack>}
    </>
  );
};

