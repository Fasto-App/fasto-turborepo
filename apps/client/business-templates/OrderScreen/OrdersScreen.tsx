import React, { FC } from 'react'
import { OrangeBox } from '../../components/OrangeBox'
import { Box, Divider, HStack, Heading, Text, VStack, Pressable, ScrollView, Badge } from 'native-base'
import { UpperSection } from '../../components/UpperSection'
import { FDSSelect } from '../../components/FDSSelect'
import { BottomSection } from '../../components/BottomSection'
import { useTranslation } from 'next-i18next'
import { useGetCheckoutsByBusinessQuery } from '../../gen/generated'
import { LoadingItems } from './LoadingItems'
import { parseToCurrency } from 'app-helpers'
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { getLocale } from '../../authUtilities/utils'

const TableHeader: FC = ({ children }) => <Heading textAlign={"center"} flex="1" size={"md"}>{children}</Heading>

const TableData: FC = ({ children }) => <Text textAlign={"center"} flex="1" fontSize={"md"}>{children}</Text>

const Header = () => {
  const { t } = useTranslation("businessOrders")
  return (
    <>
      <HStack justifyContent={"space-between"} pb="2" bgColor={"white"}>
        <TableHeader>{t("orders")}</TableHeader>
        <TableHeader> {t("date")}</TableHeader>
        <TableHeader>{t("amount")}</TableHeader>
        <TableHeader>{t("status")}</TableHeader>
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
}

const OrderDetails = ({ _id, date, total, status }: OrderDetailsProps) => {
  return (
    <Pressable _hover={{ backgroundColor: "secondary.100" }}>
      <HStack justifyContent={"space-between"} py="4">
        <TableData>{_id}</TableData>
        <TableData>{date}</TableData>
        <TableData>{total}</TableData>
        <TableData>
          <Badge variant={"subtle"} colorScheme={"info"}>{status}</Badge>
        </TableData>
      </HStack>
    </Pressable>
  )
}

//  create new array with 10 elements

export const OrdersScreen = () => {
  const router = useRouter()
  const { t } = useTranslation("businessOrders")
  const { data, loading, error } = useGetCheckoutsByBusinessQuery()

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
                setSelectedValue={function (value: string): void {
                  throw new Error('Function not implemented.')
                }} array={[]}
              />

              <FDSSelect
                w={"100px"}
                h={"8"}
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
              <ScrollView stickyHeaderIndices={[0]}>
                <Header />
                {data?.getCheckoutsByBusiness.map((checkout, i) => (
                  <OrderDetails
                    _id={`#${checkout._id.slice(0, 8)}`}
                    key={checkout._id}
                    date={format(Number(checkout.created_date), "PPpp", getLocale(router.locale))}
                    total={parseToCurrency(checkout.total)}
                    status={checkout.status}
                  />
                )).reverse()}
              </ScrollView>}
        </BottomSection>
      </VStack>
    </Box>
  )
}
