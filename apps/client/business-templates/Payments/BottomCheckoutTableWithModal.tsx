import React, { FC, useMemo, useState } from "react"
import { typedKeys, parseToCurrency, PRODUCT_PLACEHOLDER_IMAGE } from "app-helpers"
import { format } from "date-fns"
import { businessRoute } from "fasto-route"
import { Badge, Box, Button, Checkbox, ChevronLeftIcon, ChevronRightIcon, Divider, FlatList, HStack, Heading, Pressable, Select, Text, VStack } from "native-base"
import router, { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { getLocale } from "../../authUtilities/utils"
import { BottomSection } from "../../components/BottomSection"
import { CustomModal } from "../../components/CustomModal/CustomModal"
import { LoadingCartItems } from "../../customer-templates/CartScreen/LoadingTiles"
import { PastOrdersTile } from "../../customer-templates/CartScreen/PastOrdersModal"
import { useGetCheckoutsByBusinessQuery, CheckoutStatusKeys, useGetOrdersByCheckoutQuery, useDeleteCheckoutDataMutation, GetCheckoutsByBusinessDocument } from "../../gen/generated"
import { LoadingItems } from "../OrderScreen/LoadingItems"
import { ColorSchemeType } from "native-base/lib/typescript/components/types"
import { Icon } from '../../components/atoms/NavigationButton'
import { Alert } from "../../components/DeleteAlert"
import { showToast } from "../../components/showToast"

type CheckoutState = {
  isOpen: boolean;
  checkoutId: string;
}
export const BottomCheckoutTableWithModal = ({ setModalData, modalData }: {
  modalData: CheckoutState,
  setModalData: React.Dispatch<React.SetStateAction<CheckoutState>>
}) => {
  const router = useRouter()
  const { t } = useTranslation("businessPayments")

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  const { data, loading, error, fetchMore } = useGetCheckoutsByBusinessQuery({
    variables: { page: pagination.page, pageSize: pagination.pageSize },
  })

  const onNextPage = () => {
    // if this page has less items than page size, it means there's no next
    if ((data?.getCheckoutsByBusiness.length || 0) < pagination.pageSize) {
      return false
    }

    const nextPage = pagination.page + 1;
    setPagination({ ...pagination, page: nextPage });
    fetchMore({ variables: { page: nextPage, pageSize: pagination.pageSize } });
  };

  const onPreviousPage = () => {
    const previousPage = Math.max(pagination.page - 1, 1);
    setPagination({ ...pagination, page: previousPage });
    fetchMore({ variables: { page: previousPage, pageSize: pagination.pageSize } });
  };

  const [checkoutObj, setCheckoutObj] = useState<{ [key: string]: boolean }>({})

  const checkIfItemsSelected = useMemo(() => {
    const allKeys = typedKeys(checkoutObj) as string[]

    if (allKeys.length > 0 && !loading) {
      const selectedKeys = allKeys.filter(id => checkoutObj[id])
      return selectedKeys
    }
  }, [checkoutObj, loading])

  const onDeletePressed = () => {
    if (checkIfItemsSelected) {
      setAlertIsOpen(true)
      return
    }

    //("Nothing to do!")
  }

  const [deleteCheckout, { loading: deleteloading }] = useDeleteCheckoutDataMutation({
    refetchQueries: [{
      query: GetCheckoutsByBusinessDocument,
      variables: {
        page: pagination.page, pageSize: pagination.pageSize
      }
    }],
    onCompleted(data) {
      setAlertIsOpen(false)

      showToast({
        message: t("deleteCheckoutSuccess"),
        subMessage: t("itemsWereDeleted", { count: data.deleteCheckoutData.deletedCount })
      })
    },
    onError() {
      setAlertIsOpen(false)

      showToast({
        message: t("deleteCheckoutError"),
        status: "error",
      })
    },
  })

  const deleteSelectedCheckouts = () => {
    if (checkIfItemsSelected) {
      deleteCheckout({
        variables: {
          ids: checkIfItemsSelected
        }
      })
    }
  }


  const selectAll = () => {
    const allSelected = data?.getCheckoutsByBusiness.reduce((accumulator, checkout) => {
      accumulator[checkout._id] = true
      return accumulator
    }, {} as { [key: string]: boolean })

    if (!allSelected) return

    setCheckoutObj(allSelected)
  }

  const [isAlertOpen, setAlertIsOpen] = React.useState(false);

  return <BottomSection>
    {loading ? <LoadingItems /> :
      error || !data?.getCheckoutsByBusiness ? null :
        <>
          <Alert
            body={t("body")}
            cancel={t("cancel")}
            isOpen={isAlertOpen}
            onClose={() => setAlertIsOpen(false)}
            onPress={deleteSelectedCheckouts}
            title={t("title")}
          />
          <FlatList
            contentContainerStyle={{ paddingRight: 4 }}
            ListHeaderComponent={<TableHeader
              loading={deleteloading || loading}
              onPress={onDeletePressed} // only if any are selected
              deselectedAll={() => setCheckoutObj({})}
              selectAll={selectAll}
            />}
            data={data?.getCheckoutsByBusiness}
            stickyHeaderIndices={[0]}
            keyExtractor={(checkout) => `${checkout._id}`}
            renderItem={({ item: checkout }) => (
              <OrderDetails
                key={checkout._id}
                _id={`#${checkout._id.slice(-6)}`}
                date={format(Number(checkout.created_date), "Pp", getLocale(router.locale))}
                total={parseToCurrency(checkout.total)}
                status={t(CheckoutStatusKeys[checkout.status])}
                colorScheme={checkout.status === "Paid" ? "success" : "yellow"}
                selected={!!checkoutObj[checkout._id]}
                onDelete={() => {
                  setCheckoutObj({
                    ...checkoutObj,
                    [checkout._id]: !checkoutObj[checkout._id]
                  })
                }}
                onPress={() => {
                  setModalData({
                    checkoutId: checkout._id,
                    isOpen: true
                  })
                }}
              />
            )}
          />
          <CheckoutModal
            checkoutId={modalData.checkoutId}
            isOpen={modalData.isOpen}
            setIsOpen={(isOpen) => setModalData({ checkoutId: "", isOpen })}
          />

          <HStack w={"100%"}>
            <HStack
              flex={1}
              justifyContent={"center"}
              space={4}
              alignItems={"center"}>
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
                onValueChange={itemValue => setPagination({
                  page: 1,
                  pageSize: Number(itemValue)
                })}>
                {[10, 20, 30, 50].map(pageSize => (
                  <Select.Item
                    key={pageSize}
                    label={pageSize.toString()}
                    value={pageSize.toString()}
                  />))}
              </Select>
            </Box>
          </HStack>
        </>
    }
  </BottomSection>
}

const Header: FC<{ loading: boolean }> = ({ children, loading }) => <Heading color={loading ? "coolGray.300" : "black˝"} textAlign={"center"} flex="1" size={"md"}>{children}</Heading>

const TableHeader = ({ onPress, selectAll, deselectedAll, loading }: {
  onPress: () => void,
  selectAll: () => void,
  deselectedAll: () => void,
  loading: boolean
}) => {
  const { t } = useTranslation("businessPayments")

  const onCheckboxChange = (selected: boolean) => {
    if (selected) {
      selectAll()
      return
    }

    deselectedAll()
  }

  return (
    <>
      <HStack bgColor={"white"} width={"100%"}>
        <HStack p="2" space={4}>
          <Checkbox value='All' accessibilityLabel={"All"} onChange={onCheckboxChange} />
          <Pressable onPress={onPress} isDisabled={loading}>
            <Icon type='TrashCan' size={"1.5em"} />
          </Pressable>
        </HStack>
        <HStack justifyContent={"space-between"} pb="2" bgColor={"white"} flex={1}>
          <Header loading={loading}>{t("check")}</Header>
          <Header loading={loading}> {t("date")}</Header>
          <Header loading={loading}>{t("amount")}</Header>
          <Header loading={loading}>{t("status")}</Header>
        </HStack>
      </HStack>
      <Divider />
    </>
  )
}

const TableData: FC = ({ children }) => (
  <Text textAlign={"center"} flex="1" fontSize={"md"}>{children}</Text>
)

type OrderDetailsProps = {
  _id: string;
  date: string;
  total: string;
  status: string;
  colorScheme: ColorSchemeType;
  onPress: () => void;
  onDelete: () => void;
  selected: boolean
}

const OrderDetails = ({ _id, date, total, status, colorScheme = "info", onPress, onDelete, selected }: OrderDetailsProps) => {
  return (
    <HStack alignItems={"center"} >
      <HStack p="2" space={4}>
        <Checkbox value={_id} accessibilityLabel={total} onChange={onDelete} isChecked={selected} />
        <Icon type='TrashCan' size={"1.5em"} color={"white"} />
      </HStack>

      <Pressable _hover={{ backgroundColor: "secondary.100" }} onPress={onPress} flex={1}>
        <HStack justifyContent={"space-between"} py={2}>
          <TableData>{_id}</TableData>
          <TableData>{date}</TableData>
          <TableData>{total}</TableData>
          <TableData>
            <Badge w={"full"} variant={"subtle"} colorScheme={colorScheme}>{status}</Badge>
          </TableData>
        </HStack>
      </Pressable>
    </HStack>
  )
}

type OrdersModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  checkoutId: string;
}

const CheckoutModal = ({ isOpen, setIsOpen, checkoutId }: OrdersModalProps) => {
  const { t } = useTranslation("businessPayments")

  const { data, loading, error } = useGetOrdersByCheckoutQuery({
    skip: !checkoutId,
    variables: {
      input: {
        _id: checkoutId
      }
    }
  })

  return (
    <CustomModal
      size={"xl"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      HeaderComponent={<VStack space={"2"} pb={"4"}>
        <Text fontSize={"lg"}>
          {`${t("status")}: `}
          <Badge variant={"subtle"}
            colorScheme={data?.getOrdersByCheckout.status === "Paid" ? "success" : "yellow"}>
            {data && t(data.getOrdersByCheckout.status)}</Badge>
        </Text>

        <Text fontSize={"lg"}>
          {`${t("date")}: ${format(Number(data?.getOrdersByCheckout.created_date || 0),
            "PPpp", getLocale(router.locale))}`}
        </Text>
      </VStack>}
      ModalBody={<>
        {loading ? <LoadingCartItems /> : error ? <Text>Error</Text> :
          <FlatList
            data={data?.getOrdersByCheckout.orders}
            renderItem={({ item, index }) => !!item ?
              <PastOrdersTile
                index={index}
                name={item.product.name}
                url={item.product.imageUrl || PRODUCT_PLACEHOLDER_IMAGE}
                price={parseToCurrency(item.subTotal)}
                quantity={item.quantity}
                orderStatus={item.status}
                _id={item._id}

              /> : null}
          />}
      </>}
      ModalFooter={<Button.Group space={2} flex={1} >
        <Button
          onPress={() => setIsOpen(false)}
          flex={1} colorScheme={"tertiary"}>
          {t("close")}
        </Button>
        <>
          {data?.getOrdersByCheckout.paid || router.pathname === businessRoute['checkout/[checkoutId]'] ? null :
            <Button flex={1}
              onPress={() => {
                setIsOpen(false)

                router.push({
                  pathname: businessRoute['checkout/[checkoutId]'],
                  query: {
                    checkoutId: data?.getOrdersByCheckout._id,
                    tabId: data?.getOrdersByCheckout.tab
                  }
                })
              }
              }>
              {`${t("checkout")} ${parseToCurrency(data?.getOrdersByCheckout.subTotal)}`}
            </Button>}
        </>
      </Button.Group >
      }
    />
  )
}