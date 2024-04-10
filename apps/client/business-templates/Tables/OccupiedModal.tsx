import React, { useState } from "react"
import {
  Box,
  Center,
  CheckIcon,
  Heading,
  HStack,
  Select,
  VStack,
  Text,
  Image,
  Pressable,
  Divider,
  ScrollView
} from "native-base"
import { Tile } from "../../components/Tile"
import { OrderDetail, OrderStatus, User } from "../../gen/generated"
import { parseToCurrency, typedKeys } from 'app-helpers'
import { Transition } from "../../components/Transition"
import { useTranslation } from "next-i18next"

const FilterOrderBy = {
  patron: "Patron",
  table: "Table"
} as const

type FilterOrderBy = typeof FilterOrderBy[keyof typeof FilterOrderBy]


// users and orders from getTabById Query
type OccupiedModalProps = {
  orders?: Omit<OrderDetail, "created_date">[] | null;
  users?: Pick<User, "_id" | "name">[] | null;
}
export const OccupiedModal = ({ orders, users }: OccupiedModalProps) => {
  const [filter, setFilterBy] = useState<FilterOrderBy>(FilterOrderBy.patron)
  const isFilteredByPatron = filter === FilterOrderBy.patron

  const { t } = useTranslation("businessTables")

  return (
    <Box>
      <HStack flex={1} justifyContent={"space-around"} space={2}>
        <Pressable flex={1} onPress={() => setFilterBy(FilterOrderBy.patron)}>
          <Heading
            size={"md"}
            textAlign={"center"}
            color={isFilteredByPatron ? undefined : "gray.400"}
          >
            {t("byPatron")}
          </Heading>
          <Divider bg={isFilteredByPatron ? "gray.400" : "gray.300"} />
        </Pressable>
        <Pressable flex={1} onPress={() => setFilterBy(FilterOrderBy.table)}>
          <Heading
            size={"md"}
            textAlign={"center"}
            color={!isFilteredByPatron ? undefined : "gray.400"}
          >
            {t("byTable")}
          </Heading>
          <Divider bg={!isFilteredByPatron ? "gray.400" : "gray.300"} />
        </Pressable>
      </HStack>
      <Box pb={8} pt={4}>
        <Transition
          isVisible={isFilteredByPatron}
        >
          <ScrollView horizontal={true} pb={2}>
            <HStack space={2}>
              {users?.map((patron, index) => (
                <Tile
                  variant={"outline"}
                  key={patron._id} selected={false} onPress={undefined} >
                  {`${t("person")} ${index + 1}`}
                </Tile>
              ))}
            </HStack>
          </ScrollView>
        </Transition>
        <VStack space={6} pt={"5"}>
          {!orders?.length ?
            <Center flex={1} paddingY={"10"}>
              <Heading size={"md"} textAlign={"center"}>{t("noOrdersYet")}</Heading>
            </Center>
            : orders?.map((order) => {
              if (!order) return null

              return <OrderTile key={order._id}
                imageUrl={order.product.imageUrl}
                name={order.product.name}
                price={parseToCurrency(order.product.price, order.product.currency)}
                subTotal={parseToCurrency(order.subTotal, order.product.currency)}
                quantity={order.quantity}
                status={order.status}
              />
            })}
        </VStack>
      </Box>
    </Box>
  )
}

type OrderTileProps = {
  imageUrl: OrderDetail["product"]["imageUrl"];
  name: OrderDetail["product"]["name"];
  quantity: OrderDetail["quantity"];
  status: OrderDetail["status"];
  price: string;
  subTotal: string;
}

const OrderTile = ({ imageUrl, name, price, quantity, status, subTotal }: OrderTileProps) => {
  const { t } = useTranslation("businessTables")

  return (<HStack borderRadius={"md"} p={1} backgroundColor={"white"} flex={1} justifyContent={"space-between"}>
    <HStack flex={1}>
      <Center>
        <Image src={imageUrl ?? ""}
          width={100} height={60}
          alt={name} />
      </Center>
      <VStack pl={2} pt={3}>
        <Heading size={"sm"}>{`${name}`}</Heading>
        <Text>{price}</Text>
      </VStack>
    </HStack>
    <Center flex={1}>
      <Select
        mt={1}
        maxW={200}
        selectedValue={status}
        placeholder={t("orderStatus")}
        accessibilityLabel={t("chooseService")}
        onValueChange={itemValue => console.log(itemValue)}>
        {typedKeys(OrderStatus).map((status, index) => (
          <Select.Item key={index} label={t(OrderStatus[status])} value={status} />)
        )}
      </Select>
    </Center>
    <HStack flex={1} justifyContent={"space-between"}>
      <Text>{subTotal}</Text>
      <Text >{`${quantity}x`}</Text>
      <Center p={6}>
        <CheckIcon />
      </Center>
    </HStack>
  </HStack>)
}