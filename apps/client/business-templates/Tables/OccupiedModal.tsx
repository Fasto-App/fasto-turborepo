import React, { useState } from "react"
import { Box, Center, CheckIcon, Heading, HStack, Select, VStack, Text, Image, Pressable, Divider } from "native-base"
import { Tile } from "../../components/Tile"
import { OrderDetail, OrderStatus } from "../../gen/generated"
import { parseToCurrency } from "../../utils"
import { useTableScreenStore } from "./tableScreenStore"

const FilterOrderBy = {
  patron: "Patron",
  table: "Table"
} as const

type FilterOrderBy = typeof FilterOrderBy[keyof typeof FilterOrderBy]

export const OccupiedModal = () => {
  const [tabOpen, setTabOpen] = useState<FilterOrderBy>(FilterOrderBy.patron)
  const tableChoosen = useTableScreenStore(state => state.tableChoosen)

  console.log(tableChoosen, "TABLE CHOSEN")

  return (
    <Box>
      <HStack flex={1} justifyContent={"space-around"} space={2}>
        <Pressable flex={1} onPress={() => setTabOpen(FilterOrderBy.patron)}>
          <Heading size={"md"} textAlign={"center"}>{"By Patron"}</Heading>
          <Divider bg={tabOpen === FilterOrderBy.patron ? "gray.400" : "gray.300"} />
        </Pressable>
        <Pressable flex={1} onPress={() => setTabOpen(FilterOrderBy.table)}>
          <Heading size={"md"} textAlign={"center"}>{"By Table"}</Heading>
          <Divider bg={tabOpen === FilterOrderBy.table ? "gray.400" : "gray.300"} />
        </Pressable>
      </HStack>
      <Box p={8}>
        <HStack space={2} pb={8}>
          {tableChoosen?.users?.map((patron, index) => (
            <Tile key={patron._id} selected={false} onPress={undefined} >
              {`Person ${index + 1}`}
            </Tile>
          ))}
        </HStack>
        <VStack space={6}>
          {tableChoosen?.orders?.map((order) => {
            return <OrderTile key={order._id}
              imageUrl={order.product.imageUrl}
              name={order.product.name}
              price={order.product.price}
              quantity={order.quantity}
              status={order.status}
              subTotal={order.subTotal}
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
  price: OrderDetail["product"]["price"];
  quantity: OrderDetail["quantity"];
  subTotal: OrderDetail["subTotal"];
  status: OrderDetail["status"];
}

const OrderTile = ({ imageUrl, name, price, quantity, status, subTotal }: OrderTileProps) => {
  return (<HStack borderRadius={"md"} p={1} backgroundColor={"white"} flex={1} justifyContent={"space-between"}>
    <HStack>
      <Center>
        <Image src={imageUrl}
          width={100} height={60}
          alt={name} />
      </Center>
      <VStack pl={2} pt={3}>
        <Heading size={"sm"}>{`${name}`}</Heading>
        <Text>{`${parseToCurrency(price)}`}</Text>
      </VStack>
    </HStack>

    <Center>
      <Select
        mt={1}
        minWidth="200"
        accessibilityLabel="Choose Service"
        selectedValue={status}
        placeholder="Order Status"
        onValueChange={itemValue => console.log(itemValue)}>
        {Object.keys(OrderStatus).map((status, index) => (
          <Select.Item key={index} label={status} value={status.toUpperCase()} />)
        )}
      </Select>
    </Center>
    <Center>
      <Text>{`${parseToCurrency(subTotal)}`}</Text>
    </Center>
    <Center>
      <Text >{`${quantity}x`}</Text>
    </Center>
    <Center p={6}>
      <CheckIcon />
    </Center>
  </HStack>)
}