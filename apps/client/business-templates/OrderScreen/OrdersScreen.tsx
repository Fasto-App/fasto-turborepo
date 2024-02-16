import React, { FC, useMemo, useState } from "react";
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
import { Alert } from "../../components/DeleteAlert"
import { UpperSection } from "../../components/UpperSection";
import { FDSSelect } from "../../components/FDSSelect";
import { BottomSection } from "../../components/BottomSection";
import { useTranslation } from "next-i18next";
import {
  DateType,
  GetOrdersGroupDocument,
  OrderStatus,
  TakeoutDeliveryDineIn,
  useDeleteOrdersGroupDataMutation,
  useGetOrdersGroupQuery,
} from "../../gen/generated";
import { LoadingItems } from "./LoadingItems";
import { typedKeys, typedValues } from "app-helpers";
import router from "next/router";
import { ColorSchemeType } from "native-base/lib/typescript/components/types";
import { OrdersModal } from "./OrdersModal";
import { Icon } from "../../components/atoms/NavigationButton";
import { showToast } from "../../components/showToast";
import { getOrderColor } from "./utils";
import { formatDate } from "../../hooks/helper";

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
  deselectedAll }: {
    onPress: () => void;
    selectAll: () => void;
    deselectedAll: () => void;
    loading: boolean
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
      </HStack>
      <Pressable
        _hover={{ backgroundColor: "secondary.100" }}
        onPress={onPress}
        flex={1}
      >
        <HStack justifyContent={"space-between"} py={2} space={4}>
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

const tabs = typedValues(OrderStatus);
const types = typedValues(TakeoutDeliveryDineIn).map(type => ({
  _id: type,
  value: type
}))

export const OrdersScreen = () => {
  const { t } = useTranslation("businessOrders");
  const [modalData, setModalData] = useState({ isOpen: false, orderId: "" });
  const [selectedTab, setSelectedTab] = useState<OrderStatus>();
  const [selectedType, setSelectedType] = useState<TakeoutDeliveryDineIn>()

  const renderCategories = ({
    item,
    index,
  }: {
    item: OrderStatus;
    index: number;
  }) => {
    const selected = selectedTab === item;

    return (
      <>
        <Button
          px={4}
          m={0}
          minW={"100px"}
          borderColor={selected ? "primary.500" : "gray.300"}
          disabled={selected}
          variant={selected ? "outline" : "outline"}
          colorScheme={selected ? "primary" : "black"}
          onPress={() => {
            setSelectedTab(item);
            // fetchMore()
          }}
        >
          {t(OrderStatus[item])}
        </Button>
        {index === tabs.length - 1 && renderAllButton()}
      </>
    );
  };

  const renderAllButton = () => {
    const selected = selectedTab === undefined;
    return (
      <Button
        px={4}
        m={0}
        ml={4}
        marginRight={30}
        minW={"100px"}
        borderColor={selected ? "primary.500" : "gray.300"}
        disabled={selected}
        variant={selected ? "outline" : "outline"}
        colorScheme={selected ? "primary" : "black"}
        onPress={() => {
          setSelectedTab(undefined);
        }}
      >
        {t("AllOrders")}
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
            {process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && <HStack space={"2"}>
              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={"Type"}
                selectedValue={selectedType}
                setSelectedValue={setSelectedType}
                array={types}
              />
            </HStack>}
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
  selectedTab?: OrderStatus;
  selectedType?: TakeoutDeliveryDineIn;
};

export const BottomOrdersTableWithModal: React.FC<
  BottomOrdersTableWithModalProps
> = ({ setModalData, modalData, selectedTab, selectedType }) => {
  const { t } = useTranslation("businessOrders");

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const queryInput = {
    dateType: DateType.NinetyDays,
    page: pagination.page,
    pageSize: pagination.pageSize,
    status: selectedTab,
    type: selectedType
  }

  const { data, loading, error, fetchMore } = useGetOrdersGroupQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      input: queryInput
    },
  });

  const isThereNextPage = (data?.getOrdersGroup?.length || 0) < pagination.pageSize

  const onNextPage = () => {
    if (isThereNextPage) return

    const nextPage = pagination.page + 1;
    setPagination({ ...pagination, page: nextPage });
    fetchMore({
      variables: {
        input: {
          ...queryInput,
          page: nextPage, pageSize: pagination.pageSize
        }
      }
    });
  };

  const previousPage = Math.max(pagination.page - 1, 1);

  const onPreviousPage = () => {
    setPagination({ ...pagination, page: previousPage });
    fetchMore({
      variables: {
        input: {
          ...queryInput,
          page: previousPage, pageSize: pagination.pageSize
        }
      },
    });
  };

  const [orderObj, setOrderObj] = useState<{ [key: string]: boolean }>({});

  const checkIfItemsSelected = useMemo(() => {
    const allKeys = typedKeys(orderObj) as string[]

    if (allKeys.length > 0 && !loading) {
      const selectedKeys = allKeys.filter(id => orderObj[id])
      return selectedKeys
    }
  }, [orderObj, loading])



  const onDeletePressed = () => {
    if (checkIfItemsSelected) {
      setAlertIsOpen(true)
      return
    }
  }

  const [deleteOrder, { loading: deleteLoading }] = useDeleteOrdersGroupDataMutation({
    refetchQueries: [{
      query: GetOrdersGroupDocument,
      variables: {
        input: {
          dateType: DateType.NinetyDays,
          page: pagination.page,
          pageSize: pagination.pageSize,
          status: selectedTab,
        }
      }
    }],
    onCompleted(data) {
      setAlertIsOpen(false)

      showToast({
        message: t("deleteOrderSuccess"),
        subMessage: t("itemsWereDeleted", { count: data.deleteOrdersGroupData.deletedCount })
      })
    },
    onError() {
      setAlertIsOpen(false)

      showToast({
        message: t("deleteOrderError"),
        status: "error",
      })
    },
  })

  const deleteSelectedOrders = () => {
    if (checkIfItemsSelected) {
      deleteOrder({
        variables: {
          ids: checkIfItemsSelected
        }
      })
    }
  }

  const selectAll = () => {
    const allSelected = data?.getOrdersGroup?.reduce((accumulator, order) => {
      accumulator[order._id] = true;
      return accumulator;
    }, {} as { [key: string]: boolean });

    if (!allSelected) return;


    setOrderObj(allSelected);
  };

  const [isAlertOpen, setAlertIsOpen] = React.useState(false);

  return (
    <BottomSection>
      <Alert
        body={t("body")}
        cancel={t("cancel")}
        isOpen={isAlertOpen}
        onClose={() => setAlertIsOpen(false)}
        onPress={deleteSelectedOrders}
        title={t("title")}
      />
      {loading ? (
        <LoadingItems />
      ) : error || !data?.getOrdersGroup ? null : (

        <FlatList
          contentContainerStyle={{ paddingRight: 4 }}
          ListHeaderComponent={
            <Header
              loading={deleteLoading || loading}
              onPress={onDeletePressed}
              deselectedAll={() => setOrderObj({})}
              selectAll={selectAll}
            />
          }
          data={data?.getOrdersGroup}
          stickyHeaderIndices={[0]}
          keyExtractor={(order) => `${order._id}`}
          renderItem={({ item: order }) => (
            <OrderDetails
              key={order._id}
              _id={`#${order._id.slice(-6)}`}
              date={formatDate(order.created_date, router.locale)}
              status={t(OrderStatus[order.status])}
              colorScheme={getOrderColor(order.status)}
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
      )}

      <OrdersModal
        orderId={modalData.orderId}
        isOpen={modalData.isOpen}
        setIsOpen={(isOpen) => setModalData({ orderId: "", isOpen })}
        input={queryInput}
      />
      <HStack w={"100%"}>
        <HStack
          flex={1}
          justifyContent={"center"}
          space={4}
          alignItems={"center"}
        >
          <Pressable
            isDisabled={pagination.page === 1} _disabled={{ opacity: 0.3 }}
            onPress={onPreviousPage}>
            <ChevronLeftIcon size="5" color="blue.500" />
          </Pressable>
          <Text>{pagination.page}</Text>
          <Pressable
            isDisabled={isThereNextPage} _disabled={{ opacity: 0.3 }}
            onPress={onNextPage}>
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
    </BottomSection>
  );
};
