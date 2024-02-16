import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { SummaryComponent } from "../../components/OrderSummary";
// import { LeftSideBar } from "../../components";
import { parseToCurrency, typedKeys, typedValues } from "app-helpers";
import { UpperSection } from "../../components/UpperSection";
import { Tile } from "../../components/Tile";
import { BottomSection } from "../../components/BottomSection/BottomSection";
import { ProductTile } from "../../components/Product/Product";
import {
  GetTableByIdDocument,
  Product,
  useCreateMultipleOrderDetailsMutation,
  useCreateOrdersCheckoutMutation,
  useGetMenuByIdQuery,
  useGetTabByIdQuery,
  useRequestCloseTabMutation,
} from "../../gen/generated";
import { businessRoute } from "fasto-route";
import { useTranslation } from "next-i18next";
import { showToast } from "../../components/showToast";
import { Icon } from "../../components/atoms/NavigationButton";
import { Flex, Divider, Box, HStack, Heading, VStack, Input, ScrollView, Button, Text } from "native-base";
import { LeftSideBar } from "../../components/LeftSideBar";

// Helper can be outside of component
// specially if we want to reuse this
const searchProductsByName = (
  searchString: string,
  products: Product[]
): Product[] => {
  if (!searchString) {
    return products;
  }
  const pattern = new RegExp(searchString, "gi");

  return products.filter((product) => pattern.test(product.name));
};

type NewOrder = Product & { orderQuantity: number; selectedUser?: string, productId: string };
export const AddToOrder = () => {
  const route = useRouter();
  const { tabId } = route.query;

  const [orderItems, setOrderItems] = React.useState<Record<string, NewOrder>>({});
  const [selectedUser, setSelectedUser] = React.useState<string>();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const { t } = useTranslation("businessAddToOrder");

  const [createOrderCheckout, { loading: createOrderCheckoutLoading }] =
    useCreateOrdersCheckoutMutation({
      onCompleted: (data) => {
        const checkoutId = data?.createOrdersCheckout?._id;
        if (!checkoutId) throw new Error("Checkout id is missing");

        showToast({ message: t("ordersCreatedSuccessfully") });

        route.push({
          pathname: businessRoute["checkout/[checkoutId]"],
          query: {
            checkoutId,
            tabId: data?.createOrdersCheckout.tab,
          },
        });
      },
      onError: () => {
        showToast({
          status: "error",
          message: t("errorCreatingOrders"),
        });
      },
    });

  const [requestCloseTabMutation, { loading: loadingCloseTab }] =
    useRequestCloseTabMutation({
      refetchQueries: ["GetSpacesFromBusiness"],
      onCompleted: (data) => {
        showToast({
          message: t("requestToCloseTabSuccessfully"),
        });

        const status = data?.requestCloseTab?.status;
        const checkoutId = data?.requestCloseTab?.checkout;

        switch (status) {
          case "Pendent":
            if (!checkoutId) throw new Error("Checkout id is missing");

            route.push({
              pathname: businessRoute["checkout/[checkoutId]"],
              query: {
                checkoutId,
                tabId,
              },
            });
            break;
          default:
            route.back();
            break;
        }
      },
    });

  const { data: menuData } = useGetMenuByIdQuery({
    onError: () => {
      showToast({
        message: t("errorGettingMenu"),
        status: "error",
      });
    },
  });

  const { data: tabData } = useGetTabByIdQuery({
    skip: !tabId,
    variables: {
      input: {
        _id: tabId as string,
      },
    },
    onCompleted: () => {
      // if data has status of pending, send to checkout
      // if (data?.getTabByID?. === "pending") {
      // }
    },
    onError: () => {
      showToast({
        status: "error",
        message: t("errorGettingTabData"),
      });
    },
  });

  const [createOrders, { loading }] = useCreateMultipleOrderDetailsMutation({
    refetchQueries: [
      {
        query: GetTableByIdDocument,
        variables: {
          input: {
            _id: tabData?.getTabByID?.table?._id,
          },
        },
      },
    ],
    onCompleted: () => {
      showToast({ message: t("ordersCreatedSuccessfully") });

      route.back();
    },
    onError: () => {
      showToast({
        status: "error",
        message: t("errorCreatingOrders"),
      });
    },
  });

  const onSendToKitchen = useCallback(async () => {
    // trasnform the orderItems to the correct format
    if (tabId) {
      const orderItemsToCreate = Object.values(orderItems).map((order) => ({
        ...(order?.selectedUser && { user: order?.selectedUser }),
        product: order.productId,
        user: order?.selectedUser,
        quantity: order.orderQuantity,
        tab: tabId as string,
      }));

      return await createOrders({
        variables: {
          input: orderItemsToCreate,
        },
      });
    }

    const orderItemsToCreate = Object.values(orderItems).map((order) => ({
      ...(order?.selectedUser && { user: order?.selectedUser }),
      product: order.productId,
      quantity: order.orderQuantity,
    }));

    return await createOrderCheckout({
      variables: {
        input: orderItemsToCreate,
      },
    });
  }, [createOrderCheckout, createOrders, orderItems, tabId]);

  const requestCloseTab = useCallback(() => {
    requestCloseTabMutation({
      variables: {
        input: {
          _id: tabId as string,
        },
      },
    });
  }, [requestCloseTabMutation, tabId]);

  const sections = menuData?.getMenuByID?.sections || [];

  const total = Object.values(orderItems).reduce(
    (acc, item) => acc + item.price * item.orderQuantity,
    0
  );

  const allProducts = ([] as (typeof sections)[number]["products"]).concat(
    ...sections.map((section) => section.products || [])
  );

  const allCategory = useMemo(() => ({
    category: {
      _id: "all",
      name: t("all"),
    },
    products: allProducts,
  }), [allProducts, t]);

  const sectionsWithAll = useMemo(() => [allCategory, ...sections], [allCategory, sections]);

  const [searchString, setSearchString] = React.useState<string>("");
  const filteredSections = useMemo(() => {
    return sectionsWithAll
      .filter((section) => {
        return (
          selectedCategory === "all" ||
          selectedCategory === section.category._id
        );
      })
      .map((section) => {
        return {
          ...section,
          products: searchProductsByName(searchString, section.products),
        };
      });
  }, [sectionsWithAll, selectedCategory, searchString]);

  const onRemoveOrderItem = useCallback((orderId: string) => {
    setOrderItems(prevOrderItems => {
      const newOrderItems = { ...prevOrderItems };
      delete newOrderItems[orderId]; // Remove the order item by id
      return newOrderItems;
    })

    showToast({
      message: "Removed",
      status: "warning",
    })
  }, [])

  const onAddOrIncreaseQnt = useCallback((order: NewOrder) => {
    setOrderItems(prevOrderItems => ({
      ...prevOrderItems,
      [order._id]: {
        ...order,
        // Add or update the order item by id
        orderQuantity: (prevOrderItems[order._id]?.orderQuantity || order.orderQuantity) + 1,
      },
    }));

    showToast({
      message: "Added",
      status: "success",
    })
  }, [])

  const onDecrease = useCallback(
    (orderId: string) => {
      setOrderItems(prevOrderItems => ({
        ...prevOrderItems,
        [orderId]: {
          ...prevOrderItems[orderId],
          orderQuantity: prevOrderItems[orderId]?.orderQuantity - 1,
        },
      }));

      showToast({
        message: "Subtracted",
        status: "warning"
      })
    },
    [],
  )

  const onDecreaseQnt = useCallback((order: NewOrder) => {
    if (order.orderQuantity <= 1) {
      return onRemoveOrderItem(order._id);
    }

    onDecrease(order._id)
  }, [onDecrease, onRemoveOrderItem])

  return (
    <Flex flexDirection={"row"} flex={1}>
      <LeftSideBar>
        <Flex flex={1} pt={2} pb={4}>
          <Flex direction="row" justify="space-evenly" mb={4}>
            {tabData?.getTabByID?.table?.tableNumber ? (
              <Text py="2">
                {t("tableNumber", {
                  number: tabData?.getTabByID?.table?.tableNumber,
                })}
              </Text>
            ) : null}
            {tabData?.getTabByID?.table?.tableNumber &&
              (tabData?.getTabByID?.users?.length ?? 0) > 1 ? (
              <Divider orientation="vertical" mx="3" />
            ) : null}
            {(tabData?.getTabByID?.users?.length ?? 0) > 1 ? (
              <Text py="2">
                {t("people", { number: tabData?.getTabByID?.users?.length })}
              </Text>
            ) : null}
          </Flex>
          <ScrollView flex={1}>
            {typedValues(orderItems)?.map((order, index) => {
              const personIndex = tabData?.getTabByID?.users?.findIndex(
                (user) => user._id === order.selectedUser
              );

              return (
                <SummaryComponent
                  key={order._id + order.selectedUser}
                  lastItem={index === typedValues(orderItems).length - 1}
                  assignedToPersonIndex={
                    personIndex !== undefined && personIndex !== -1
                      ? personIndex + 1
                      : undefined
                  }
                  name={order.name}
                  price={parseToCurrency(order.price, order.currency)}
                  quantity={order.orderQuantity}
                  onEditPress={() => console.log("EDIT")}
                  onRemovePress={() => onRemoveOrderItem(order._id)}
                  onPlusPress={() => onAddOrIncreaseQnt(order)}
                  onMinusPress={() => onDecreaseQnt(order)}
                />
              );
            })}
          </ScrollView>
          <Box w={"100%"} justifyContent={"end"} pt={2}>
            <Divider mb="3" />
            <HStack justifyContent={"space-between"} pb={4}>
              <Heading size={"md"}>{t("total")}</Heading>
              <Heading size={"md"}>{parseToCurrency(total)}</Heading>
            </HStack>
            <VStack space={4}>
              <Button
                w={"full"}
                isLoading={loading || createOrderCheckoutLoading}
                onPress={onSendToKitchen}
                isDisabled={typedKeys(orderItems).length <= 0}
              >
                {t("sendToKitchen")}
              </Button>
              <Button
                flex={1}
                p={0}
                variant="link"
                size="sm"
                colorScheme="info"
                onPress={() => route.back()}
                justifyContent={"end"}
              >
                {t("back")}
              </Button>
            </VStack>
          </Box>
        </Flex>
      </LeftSideBar>
      <Box flex={1}>
        <Box
          backgroundColor={"primary.500"}
          h={100}
          w={"100%"}
          position={"absolute"}
          zIndex={-1}
        />
        <VStack flex={1} p={4} space={4}>
          <UpperSection>
            <Heading>{t("patrons")}</Heading>
            <HStack space={2}>
              <ScrollView horizontal={true} pb={2}>
                <HStack space={2}>
                  <Tile
                    selected={!selectedUser}
                    onPress={() => setSelectedUser(undefined)}
                  >
                    {t("table")}
                  </Tile>
                  {tabData?.getTabByID?.users?.map((user, index) => (
                    <Tile
                      key={user._id}
                      selected={user._id === selectedUser}
                      onPress={() => setSelectedUser(user._id)}
                    >
                      {`Person ${index + 1}`}
                    </Tile>
                  ))}
                </HStack>
              </ScrollView>
            </HStack>
            {tabId ? (
              <Button
                colorScheme={"primary"}
                width={"100px"}
                onPress={requestCloseTab}
                isLoading={loadingCloseTab}
              >
                {t("closeTab")}
              </Button>
            ) : null}
          </UpperSection>
          <BottomSection>
            <HStack space={2}>
              <Heading pr={10}>{t("menu")}</Heading>
              <ScrollView horizontal={true} pb={2}>
                <HStack space={2}>
                  {sectionsWithAll.map((section) => (
                    <Tile
                      key={section.category._id}
                      selected={section.category._id === selectedCategory}
                      onPress={() => setSelectedCategory(section.category._id)}
                    >
                      {section.category.name}
                    </Tile>
                  ))}
                </HStack>
              </ScrollView>
            </HStack>
            <VStack flexDir={"row"} flexWrap={"wrap"} paddingY={2}>
              <Input
                placeholder={t("search")}
                variant="rounded"
                borderRadius="10"
                size="md"
                value={searchString}
                onChangeText={(text) => {
                  setSearchString(text);
                }}
                InputLeftElement={<Box p="1"><Icon type="Search" /></Box>}
              />
            </VStack>
            <ScrollView pt={2}>
              <VStack flexDir={"row"} flexWrap={"wrap"} space={4}>
                {filteredSections.map((section) => (
                  <React.Fragment key={section.category._id}>
                    {selectedCategory === section.category._id &&
                      section.products.map((product) => (
                        <ProductTile
                          ctaTitle={t("add")}
                          key={product._id}
                          name={product.name}
                          imageUrl={product.imageUrl ?? ""}
                          description={product.description}
                          quantity={product.quantity}
                          hideButton={
                            !!product.blockOnZeroQuantity &&
                            !product.quantity
                          }
                          onPress={() => {
                            onAddOrIncreaseQnt({
                              _id: selectedUser ? `${product._id}:${selectedUser}` : product._id,
                              name: product.name,
                              imageUrl: product.imageUrl,
                              description: product.description,
                              quantity: product.quantity,
                              price: product.price,
                              selectedUser,
                              orderQuantity: 0,
                              productId: product._id,
                            })
                          }}
                        />
                      ))}
                  </React.Fragment>
                ))}
              </VStack>
            </ScrollView>
          </BottomSection>
        </VStack>
      </Box>
    </Flex>
  );
};
