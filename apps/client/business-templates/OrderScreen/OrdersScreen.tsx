import React, { FC, useState } from 'react'
import { OrangeBox } from '../../components/OrangeBox'
import { Box, Divider, HStack, Heading, Text, VStack, Pressable, ScrollView, Badge, FlatList } from 'native-base'
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
  return (
    <HStack alignItems={"center"} >
      <Pressable p={2}
        borderRadius={"md"}
        _hover={{ backgroundColor: "danger.100" }}
        onPress={onDelete}
      >
        <Icon type='TrashCan' size={"1.5em"} />
      </Pressable>
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
  const router = useRouter()
  const { t } = useTranslation("businessOrders")
  const { data, loading, error } = useGetCheckoutsByBusinessQuery()
  const [modalData, setModalData] = useState({ isOpen: false, checkoutId: "" })

  return (
    <Box flex="1">
      <OrangeBox height={"78"} />
      <OrdersModal
        checkoutId={modalData.checkoutId}
        isOpen={modalData.isOpen}
        setIsOpen={(isOpen) => setModalData({ checkoutId: "", isOpen })}
      />
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
        <BottomSection>
          {loading ? <LoadingItems /> :
            error || !data?.getCheckoutsByBusiness ? null :
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
                    onDelete={() => console.log("deleting Order")}
                    onPress={() => {
                      setModalData({
                        checkoutId: checkout._id,
                        isOpen: true
                      })
                    }}
                  />
                )}
              />
          }
        </BottomSection>
      </VStack>
    </Box>
  )
}
