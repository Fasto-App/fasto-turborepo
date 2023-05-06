import React, { FC } from 'react'
import { OrangeBox } from '../../components/OrangeBox'
import { Box, Divider, HStack, Heading, Text, VStack, Pressable, ScrollView, Badge } from 'native-base'
import { UpperSection } from '../../components/UpperSection'
import { FDSSelect } from '../../components/FDSSelect'
import { BottomSection } from '../../components/BottomSection'
import { useTranslation } from 'next-i18next'

const TableHeader: FC = ({ children }) => <Heading textAlign={"center"} flex="1" size={"md"}>{children}</Heading>

const TableData: FC = ({ children }) => <Text textAlign={"center"} flex="1" fontSize={"md"}>{children}</Text>

const Header = () => {
  const { t } = useTranslation("businessOrders")
  return (
    <HStack justifyContent={"space-between"} pb="2">
      <TableHeader>{t("orders")}</TableHeader>
      <TableHeader> {t("date")}</TableHeader>
      <TableHeader>{t("amount")}</TableHeader>
      <TableHeader>{t("status")}</TableHeader>
    </HStack>
  )
}

const OrderDetails = () => {
  return (
    <Pressable _hover={{ backgroundColor: "secondary.100" }}>
      <HStack justifyContent={"space-between"} py="4">
        <TableData>{"#123456"}</TableData>
        <TableData>{"12 July 2022, 12:42 PM"}</TableData>
        <TableData>{"$89.00"}</TableData>
        <TableData>
          <Badge variant={"subtle"} colorScheme={"info"}>{"Pendent"}</Badge>
        </TableData>
      </HStack>
    </Pressable>
  )
}

//  create new array with 10 elements
const array = Array.from({ length: 9 }, (_, i) => i + 1)


export const OrdersScreen = () => {
  const { t } = useTranslation("businessOrders")

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
          <Header />
          <Divider />
          <ScrollView>
            <VStack>
              {array.map((_, i) => <OrderDetails key={i} />)}
            </VStack>
          </ScrollView>
        </BottomSection>
      </VStack>
    </Box>
  )
}
