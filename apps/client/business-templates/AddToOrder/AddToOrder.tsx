import React, { useCallback, useMemo } from "react";
import {
  Button,
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  ScrollView,
  Input,
} from "native-base";
import { useRouter } from "next/router";
import { SummaryComponent } from "../../components/OrderSummary";
import { LeftSideBar } from "../../components";
import { parseToCurrency } from "app-helpers";
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
import { OrangeBox } from "../../components/OrangeBox";
import { Icon } from "../../components/atoms/NavigationButton";

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

type NewOrder = Product & { quantity: number; selectedUser?: string };

export const AddToOrder = () => {
  const route = useRouter();
  const { tabId } = route.query;

  const [orderItems, setOrderItems] = React.useState<NewOrder[]>([]);
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
    if (tabId) {
      return await createOrders({
        variables: {
          input: orderItems.map((order) => ({
            ...(order?.selectedUser && { user: order?.selectedUser }),
            tab: Array.isArray(tabId) ? tabId[0] : tabId,
            product: order._id,
            quantity: order.quantity,
          })),
        },
      });
    }

    return await createOrderCheckout({
      variables: {
        input: orderItems.map((order) => ({
          product: order._id,
          quantity: order.quantity,
        })),
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
  const total = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
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

  const [searchString, setSearchString] = React.useState<string | any>("");
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

  const getOrderById = (id: string) => {
    return orderItems.find((item) => item._id === id);
  };

  const getProductById = (orderId: string) => {
    return allProducts.find((item) => item._id === orderId);
  };

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
            {orderItems?.map((order, index) => {
              const personIndex = tabData?.getTabByID?.users?.findIndex(
                (user) => user._id === order.selectedUser
              );
              let selectedUserIndex;

              if (personIndex !== undefined && personIndex !== -1) {
                selectedUserIndex = personIndex + 1;
              }

              return (
                <SummaryComponent
                  key={order._id + selectedUserIndex}
                  lastItem={index === orderItems.length - 1}
                  assignedToPersonIndex={selectedUserIndex}
                  name={order.name}
                  price={parseToCurrency(order.price, order.currency)}
                  quantity={order.quantity}
                  onEditPress={() => console.log("EDIT")}
                  onRemovePress={() => {
                    const newOrderItems = orderItems.filter(
                      (_, orderIndex) => index !== orderIndex
                    );
                    setOrderItems(newOrderItems);
                  }}
                  onPlusPress={() => {
                    //TODO: we should update `orderItems` from an array state to an object
                    // to avoid nested loops when updating the quantity
                    const newOrderItems = orderItems.map((item, orderIndex) => {
                      // const product = getProductById(item._id);

                      if (
                        item._id === order._id
                        // index === orderIndex &&
                        // product?.quantity &&
                        // product?.quantity - order.quantity > 0
                      ) {
                        return {
                          ...item,
                          quantity: item.quantity + 1,
                        };
                      }
                      return item;
                    });
                    setOrderItems(newOrderItems);
                  }}
                  onMinusPress={() => {
                    if (order.quantity === 1) {
                      const newOrderItems = orderItems.filter(
                        (_, orderIndex) => index !== orderIndex
                      );
                      setOrderItems(newOrderItems);
                      return;
                    }

                    const newOrderItems = orderItems.map((item, orderIndex) => {
                      if (index === orderIndex && item.quantity > 1) {
                        return {
                          ...item,
                          quantity: item.quantity - 1,
                        };
                      }
                      return item;
                    });
                    setOrderItems(newOrderItems);
                  }}
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
                isDisabled={orderItems.length <= 0}
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
        <OrangeBox />
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
                          // hideButton={
                            // !product.quantity ||
                            // (getOrderById(product._id) &&
                              // product.quantity -
                              // getOrderById(product._id)!.quantity <
                              // 1)
                          // }
                          onPress={() => {
                            const findIndex = orderItems.findIndex(
                              (order) =>
                                order._id === product._id &&
                                order?.selectedUser === selectedUser
                            );

                            if (findIndex >= 0) {
                              const newOrder = {
                                ...orderItems[findIndex],
                                quantity: orderItems[findIndex].quantity + 1,
                                selectedUser,
                              };

                              const newArray = orderItems.map((order, index) =>
                                index === findIndex ? newOrder : order
                              );

                              return setOrderItems(newArray);
                            }

                            setOrderItems([
                              ...orderItems,
                              { ...product, quantity: 1, selectedUser },
                            ]);
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
