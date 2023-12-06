import React, { FC, useState } from "react";
import { OrangeBox } from "../../components/OrangeBox";
import {
  Box,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
  Pressable,
  Badge,
  FlatList,
  Checkbox,
  ChevronRightIcon,
  ChevronLeftIcon,
  Select,
  Button,
} from "native-base";
import { UpperSection } from "../../components/UpperSection";
import { FDSSelect } from "../../components/FDSSelect";
import { BottomSection } from "../../components/BottomSection";
import { useTranslation } from "next-i18next";
import {
  CheckoutStatusKeys,
  DateType,
  OrderStatus,
  TakeoutDeliveryDineIn,
  useGetCheckoutsByBusinessQuery,
  useGetOrdersGroupQuery,
} from "../../gen/generated";
import { LoadingItems } from "./LoadingItems";
import { parseToCurrency, typedKeys } from "app-helpers";
import format from "date-fns/format";
import { useRouter } from "next/router";
import { getLocale } from "../../authUtilities/utils";
import { ColorSchemeType } from "native-base/lib/typescript/components/types";
import { OrdersModal } from "./OrdersModal";
import { Icon } from "../../components/atoms/NavigationButton";
import { string } from "zod";

const TableHeader: FC = ({ children }) => (
  <Heading textAlign={"center"} flex="1" size={"md"}>
    {children}
  </Heading>
);

const TableData: FC = ({ children }) => (
  <Text textAlign={"center"} flex="1" fontSize={"md"}>
    {children}
  </Text>
);

const Header = ({
  onPress,
  selectAll,
  deselectedAll,
}: {
  onPress: () => void;
  selectAll: () => void;
  deselectedAll: () => void;
}) => {
  const { t } = useTranslation("businessOrders");

  return (
    <>
      <HStack bgColor={"white"} width={"100%"}>
        <HStack p="2" space={4}>
          <Checkbox
            value="All"
            accessibilityLabel={"All"}
            onChange={(selected) => {
              console.log("change state", selected);
              if (selected) {
                selectAll();
                return;
              }

              deselectedAll();
            }}
          />
          <Pressable onPress={onPress}>
            <Icon type="TrashCan" size={"1.5em"} />
          </Pressable>
        </HStack>
        <HStack
          justifyContent={"space-between"}
          pb="2"
          bgColor={"white"}
          flex={1}
        >
          <TableHeader>{t("orderNumber")}</TableHeader>
          <TableHeader> {t("date")}</TableHeader>
          <TableHeader>{t("status")}</TableHeader>
        </HStack>
      </HStack>
      <Divider />
    </>
  );
};

type OrderDetailsProps = {
  _id: string;
  date: string;
  status: string;
  colorScheme: ColorSchemeType;
  onPress: () => void;
  onDelete: () => void;
  selected: boolean;
};

const OrderDetails = ({
  _id,
  date,
  status,
  colorScheme = "info",
  onPress,
  onDelete,
  selected,
}: OrderDetailsProps) => {
  return (
    <HStack alignItems={"center"}>
      <HStack p="2" space={4}>
        <Checkbox value={_id} onChange={onDelete} isChecked={selected} />
        <Box width="1.5em" />
        {/* <Pressable onPress={() => console.log("delete everything")}>
          <Icon type='TrashCan' size={"1.5em"} />
        </Pressable> */}
      </HStack>

      <Pressable
        _hover={{ backgroundColor: "secondary.100" }}
        onPress={onPress}
        flex={1}
      >
        <HStack justifyContent={"space-between"} py={2}>
          <TableData>{_id}</TableData>
          <TableData>{date}</TableData>
          <TableData>
            <Badge w={"full"} variant={"subtle"} colorScheme={colorScheme}>
              {status}
            </Badge>
          </TableData>
        </HStack>
      </Pressable>
    </HStack>
  );
};

const manageTabs = {
  Open: {
    button_title: "Open",
  },
  Pendent: {
    button_title: "Pendent",
  },
  // Ready: {
  //   button_title: "Ready",
  // },
  Delivered: {
    button_title: "Delivered",
  },
  Closed: {
    button_title: "Closed",
  },
  // AllOrders: {
  //   button_title: "All Orders",
  // }
} as const;

type ManageTab = keyof typeof manageTabs;

type ManageTabKeys = keyof typeof manageTabs;
const tabs = typedKeys(manageTabs);

export const OrdersScreen = () => {
  const { t } = useTranslation("businessOrders");
  const [modalData, setModalData] = useState({ isOpen: false, orderId: "" });
  const [selectedTab, setSelectedTab] = useState<OrderStatus>(OrderStatus.Open);

  const renderCategories = ({ item }: { item: OrderStatus }) => {
    const selected = selectedTab === item;
    console.log(selectedTab);
    return (
      <Button
        px={4}
        m={0}
        minW={"100px"}
        borderColor={selected ? "primary.500" : "gray.300"}
        disabled={selected}
        variant={selected ? "outline" : "outline"}
        colorScheme={selected ? "primary" : "black"}
        onPress={() => setSelectedTab(item)}
      >
        {t(OrderStatus[item])}
      </Button>
    );
  };

  return (
    <Box flex="1">
      <OrangeBox height={"78"} />
      <VStack flex={1} p={4} space={4}>
        <UpperSection>
          <Heading>{t("orders")}</Heading>
          <HStack justifyContent={"space-between"}>
            <FlatList
              horizontal
              data={tabs}
              renderItem={renderCategories}
              ItemSeparatorComponent={() => <Box w={4} />}
              keyExtractor={(item) => item}
            />
            {/* {t(manageTabs[item].button_title)} */}
            <HStack space={"2"}>
              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={"date"}
                setSelectedValue={function (value: string): void {
                  throw new Error("Function not implemented.");
                }}
                array={[]}
              />

              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={"status"}
                setSelectedValue={function (value: string): void {
                  throw new Error("Function not implemented.");
                }}
                array={[]}
              />
            </HStack>
          </HStack>
        </UpperSection>
        <BottomOrdersTableWithModal
          setModalData={setModalData}
          modalData={modalData}
          selectedTab={selectedTab}
        />
      </VStack>
    </Box>
  );
};

type OrderState = {
  isOpen: boolean;
  orderId: string;
};

type BottomOrdersTableWithModalProps = {
  modalData: OrderState;
  setModalData: React.Dispatch<React.SetStateAction<OrderState>>;
  selectedTab: string; // Update the type to string
};

export const BottomOrdersTableWithModal: React.FC<BottomOrdersTableWithModalProps> = ({
  setModalData,
  modalData,
  selectedTab,
}) => {
  const router = useRouter();
  const { t } = useTranslation("businessOrders");

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const onNextPage = () => {
    const nextPage = pagination.page + 1;
    setPagination({ ...pagination, page: nextPage });
    fetchMore({ variables: { page: nextPage, pageSize: pagination.pageSize } });
  };

  const onPreviousPage = () => {
    const previousPage = Math.max(pagination.page - 1, 1);
    setPagination({ ...pagination, page: previousPage });
    fetchMore({
      variables: { page: previousPage, pageSize: pagination.pageSize },
    });
  };

  const { data, loading, error, fetchMore } = useGetOrdersGroupQuery({
    variables: {
      input: {
        dateType: DateType.NinetyDays,
        page: 1,
        type: TakeoutDeliveryDineIn.DineIn,
        pageSize: 30,
      },
    },
  });
  console.log(data);
  const [orderObj, setOrderObj] = useState<{ [key: string]: boolean }>({});

  const onDelete = () => {
    if (Object.keys(orderObj).length > 0 && !loading) {
      const arrayKeys = typedKeys(orderObj).filter((id) => orderObj[id]);
      console.log("delete everything");
      console.log({ arrayKeys });
      return;
    }

    console.log("Nothing to do!");
  };

  const selectAll = () => {
    const allSelected = data?.getOrdersGroup.reduce((accumulator, order) => {
      accumulator[order._id] = true;
      return accumulator;
    }, {} as { [key: string]: boolean });

    if (!allSelected) return;

    console.log(allSelected);
    setOrderObj(allSelected);
  };

  
  const filteredOrders = data?.getOrdersGroup.filter(order => {
    switch (selectedTab) {
      case "Open":
        return order.status === "Open";
      case "Pendent":
        return order.status === "Pendent";
      case "Delivered":
        return order.status === "Delivered";
      case "Closed":
        return order.status === "Closed";
      default:
        return true; 
    }
  });
  console.log("filtered orders",  filteredOrders);
  return (
    <BottomSection>
      {loading ? (
        <LoadingItems />
      ) : error || !data?.getOrdersGroup ? null : (
        <>
          {Object.entries(manageTabs).map(([tabKey, tab]) =>
            selectedTab === tabKey ? (
              <FlatList
                key={tabKey}
                contentContainerStyle={{ paddingRight: 4 }}
                ListHeaderComponent={
                  <Header
                    onPress={onDelete}
                    deselectedAll={() => setOrderObj({})}
                    selectAll={selectAll}
                  />
                }
                data={filteredOrders}
                stickyHeaderIndices={[0]}
                keyExtractor={(order) => `${order._id}`}
                renderItem={({ item: order }) => (
                  <OrderDetails
                    key={order._id}
                    _id={`#${order._id.slice(-6)}`}
                    date={order.createdByUser}
                    status={t(OrderStatus[order.status])}
                    colorScheme={order.status === "Open" ? "success" : "yellow"}
                    selected={!!orderObj[order._id]}
                    onDelete={() => {
                      setOrderObj({
                        ...orderObj,
                        [order._id]: !orderObj[order._id],
                      });
                    }}
                    onPress={() => {
                      setModalData({
                        orderId: order._id,
                        isOpen: true,
                      });
                    }}
                  />
                )}
              />
            ) : null
          )}

          <OrdersModal
            orderId={modalData.orderId}
            isOpen={modalData.isOpen}
            setIsOpen={(isOpen) => setModalData({ orderId: "", isOpen })}
          />
          <HStack w={"100%"}>
            <HStack
              flex={1}
              justifyContent={"center"}
              space={4}
              alignItems={"center"}
            >
              <Pressable onPress={onPreviousPage}>
                <ChevronLeftIcon size="5" color="blue.500" />
              </Pressable>
              <Text>{pagination.page}</Text>
              <Pressable onPress={onNextPage}>
                <ChevronRightIcon size="5" color="blue.500" />
              </Pressable>
            </HStack>
            <Box>
              <Select
                width={"20"}
                selectedValue={pagination.pageSize.toString()}
                accessibilityLabel="Choose page size"
                placeholder="Page size"
                onValueChange={(itemValue) =>
                  setPagination({
                    ...pagination,
                    pageSize: Number(itemValue),
                  })
                }
              >
                {[10, 20, 30, 50].map((pageSize) => (
                  <Select.Item
                    key={pageSize}
                    label={pageSize.toString()}
                    value={pageSize.toString()}
                  />
                ))}
              </Select>
            </Box>
          </HStack>
        </>
      )}
    </BottomSection>
  );
};
