import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
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
import { Flex, Box, VStack } from "native-base";
import { NewOrder, OrderState } from "./types";
import { SummaryPanel } from "./SummaryPanel";
import { AddToOrderUpperSection } from "./AddToOrderUpperSection";
import { AddToOrderBottomSection } from "./AddToOrderBottomSection";

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

export const AddToOrder = () => {
  const route = useRouter();
  const { tabId } = route.query;

  const [orderItems, setOrderItems] = React.useState<OrderState>({});
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

  // const allProducts = ([] as (typeof sections)[number]["products"]).concat(
  //   ...sections.map((section) => section.products || [])
  // );

  const allCategory = useMemo(() => ({
    category: {
      _id: "all",
      name: t("all"),
    },
    products: menuData?.getMenuByID.items,
  }), [menuData?.getMenuByID.items, t]);

  const sectionsWithAll = useMemo(() => [allCategory, ...sections], [allCategory, sections]);

  const [searchString, setSearchString] = React.useState<string>("");

  // TODO fix this 
  const filteredSections = useMemo(() => {

    return sectionsWithAll
    // return sectionsWithAll
    //   .filter((section) => {
    //     return (
    //       selectedCategory === "all" ||
    //       selectedCategory === section.category._id
    //     );
    //   })
    //   .map((section) => {
    //     return {
    //       ...section,
    //       products: searchProductsByName(searchString, section.products),
    //     };
    //   });
  }, [sectionsWithAll, selectedCategory, searchString]);

  // a query that gets all products and categories


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
      <SummaryPanel
        tabData={tabData}
        orderItems={orderItems}
        loading={false}
        onRemovePress={onRemoveOrderItem}
        onPlusPress={onAddOrIncreaseQnt}
        onMinusPress={onDecreaseQnt}
        onSendToKitchen={onSendToKitchen}
      />
      <Box flex={1}>
        <Box
          backgroundColor={"primary.500"}
          h={100}
          w={"100%"}
          position={"absolute"}
        />
        <VStack flex={1} p={4} space={4}>
          <AddToOrderUpperSection
            tabData={tabData}
            isLoading={loadingCloseTab}
            requestCloseTab={requestCloseTab}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
          <AddToOrderBottomSection
            menuData={menuData}
            selectedUser={selectedUser}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddOrIncreaseQnt={onAddOrIncreaseQnt}
          />
        </VStack>
      </Box>
    </Flex>
  );
};
