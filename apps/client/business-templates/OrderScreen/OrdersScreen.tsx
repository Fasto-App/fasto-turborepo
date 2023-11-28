import React, { FC, useEffect, useState } from 'react'
import { OrangeBox } from '../../components/OrangeBox'
import { Box, Divider, HStack, Heading, Text, VStack, Pressable, Badge, FlatList, Checkbox, ChevronRightIcon, ChevronLeftIcon, Select } from 'native-base'
import { UpperSection } from '../../components/UpperSection'
import { FDSSelect } from '../../components/FDSSelect'
import { BottomSection } from '../../components/BottomSection'
import { useTranslation } from 'next-i18next'
import { CheckoutStatusKeys, useGetCheckoutsByBusinessQuery } from '../../gen/generated'
import { LoadingItems } from './LoadingItems'
import { parseToCurrency } from 'app-helpers'
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { getLocale } from '../../authUtilities/utils'
import { ColorSchemeType } from 'native-base/lib/typescript/components/types'
import { OrdersModal } from './OrdersModal'
import { Icon } from '../../components/atoms/NavigationButton'

const TableHeader: FC = ({ children }) => <Heading textAlign={"center"} flex="1" size={"md"}>{children}</Heading>

const TableData: FC = ({ children }) => <Text textAlign={"center"} flex="1" fontSize={"md"}>{children}</Text>

const Header = () => {
  const { t } = useTranslation("businessOrders")
  return (
    <>
      <HStack bgColor={"white"}>
        <Box p="2">
          <Icon type='TrashCan' size={"1.5em"} color='white' />
        </Box>
        <HStack justifyContent={"space-between"} pb="2" bgColor={"white"} flex={1}>
          <TableHeader>{t("orders")}</TableHeader>
          <TableHeader> {t("date")}</TableHeader>
          <TableHeader>{t("amount")}</TableHeader>
          <TableHeader>{t("status")}</TableHeader>
        </HStack>
      </HStack>
      <Divider />
    </>
  )
}

type OrderDetailsProps = {
  _id: string;
  date: string;
  total: string;
  status: string;
  colorScheme: ColorSchemeType;
  onPress: () => void;
  onDelete: () => void;
}

const OrderDetails = ({ _id, date, total, status, colorScheme = "info", onPress, onDelete }: OrderDetailsProps) => {
  console.log("Order Re-render")
  return (
    <HStack alignItems={"center"} >
      {/* <Pressable p={2}
        borderRadius={"md"}
        _hover={{ backgroundColor: "danger.100" }}
        onPress={onDelete}
      >
        <Icon type='TrashCan' size={"1.5em"} />
      </Pressable> */}
      <Checkbox value={_id} accessibilityLabel={total} onChange={onDelete} />
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

//  create new array with 10 elements

export const OrdersScreen = () => {
  const { t } = useTranslation("businessOrders")
  const [modalData, setModalData] = useState({ isOpen: false, checkoutId: "" })

  return (
    <Box flex="1">
      <OrangeBox height={"78"} />
      <VStack flex={1} p={4} space={4}>
        <UpperSection >
          <Heading>{t("orders")}</Heading>
          <HStack justifyContent={"space-between"}>
            <Text>{t("hereIsYourList")}</Text>
            <HStack space={"2"}>
              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={t("date")}
                setSelectedValue={function (value: string): void {
                  throw new Error('Function not implemented.')
                }} array={[]}
              />

              <FDSSelect
                w={"100px"}
                h={"8"}
                placeholder={t("status")}
                setSelectedValue={function (value: string): void {
                  throw new Error('Function not implemented.')
                }} array={[]}
              />
            </HStack>
          </HStack>
        </UpperSection>
        <BottomCheckoutTableWithModal
          setModalData={setModalData}
          modalData={modalData}
        />
      </VStack>
    </Box>
  )
}

type CheckoutState = {
  isOpen: boolean;
  checkoutId: string;
}

export const BottomCheckoutTableWithModal = ({ setModalData, modalData }: {
  modalData: CheckoutState,
  setModalData: React.Dispatch<React.SetStateAction<CheckoutState>>
}) => {
  const router = useRouter()
  const { t } = useTranslation("businessOrders")


  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  const onNextPage = () => {
    const nextPage = pagination.page + 1;
    setPagination({ ...pagination, page: nextPage });
    fetchMore({ variables: { page: nextPage, pageSize: pagination.pageSize } });
  };

  const onPreviousPage = () => {
    const previousPage = Math.max(pagination.page - 1, 1);
    setPagination({ ...pagination, page: previousPage });
    fetchMore({ variables: { page: previousPage, pageSize: pagination.pageSize } });
  };

  const { data, loading, error, fetchMore } = useGetCheckoutsByBusinessQuery({
    variables: { page: pagination.page, pageSize: pagination.pageSize },
  })

  const [checkoutObj, setCheckoutObj] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    console.log(data?.getCheckoutsByBusiness)
  }, [data?.getCheckoutsByBusiness])



  return <BottomSection>
    {loading ? <LoadingItems /> :
      error || !data?.getCheckoutsByBusiness ? null :
        <>
          <FlatList
            contentContainerStyle={{ paddingRight: 4 }}
            ListHeaderComponent={<Header />}
            data={data?.getCheckoutsByBusiness}
            stickyHeaderIndices={[0]}
            keyExtractor={(checkout) => `${checkout._id}`}
            renderItem={({ item: checkout }) => (
              <OrderDetails
                key={checkout._id}
                _id={`#${checkout._id.slice(-6)}`}
                date={format(Number(checkout.created_date), "PPpp", getLocale(router.locale))}
                total={parseToCurrency(checkout.total)}
                status={t(CheckoutStatusKeys[checkout.status])}
                colorScheme={checkout.status === "Paid" ? "success" : "yellow"}
                onDelete={() => {
                  setCheckoutObj({
                    ...checkoutObj,
                    [checkout._id]: Boolean(!(checkoutObj?.[checkout._id]))
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
          <OrdersModal
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
                  ...pagination,
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
