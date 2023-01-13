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
  ScrollView,
  PresenceTransition
} from "native-base"
import { Tile } from "../../components/Tile"
import { OrderDetail, OrderStatus, useGetTabByIdQuery } from "../../gen/generated"
import { parseToCurrency } from "../../utils"
import { useTableScreenStore } from "./tableScreenStore"

const FilterOrderBy = {
  patron: "Patron",
  table: "Table"
} as const

type FilterOrderBy = typeof FilterOrderBy[keyof typeof FilterOrderBy]

const texts = {
  byPatron: "By Patron",
  byTable: "By Table",
  person: "Person",
  chooseService: "Choose a service",
  orderStatus: "Order Status",
  noOrdersYet: "No orders yet",
}

export const OccupiedModal = () => {
  const [filter, setFilterBy] = useState<FilterOrderBy>(FilterOrderBy.patron)
  const tableChoosen = useTableScreenStore(state => state.tableChoosen)
  const isFilteredByPatron = filter === FilterOrderBy.patron
  // store the id and go through the array of orders
  // fetch information for an specific TAB 
  // const { data } = useGetTabByIdQuery({
  //   variables: {
  //     input: {
  //       _id: tableChoosen?._id
  //     }
  //   }
  // })

  // console.log({ data })

  return (
    <Box>
      <HStack flex={1} justifyContent={"space-around"} space={2}>
        <Pressable flex={1} onPress={() => setFilterBy(FilterOrderBy.patron)}>
          <Heading
            size={"md"}
            textAlign={"center"}
            color={isFilteredByPatron ? undefined : "gray.400"}
          >
            {texts.byPatron}
          </Heading>
          <Divider bg={isFilteredByPatron ? "gray.400" : "gray.300"} />
        </Pressable>
        <Pressable flex={1} onPress={() => setFilterBy(FilterOrderBy.table)}>
          <Heading
            size={"md"}
            textAlign={"center"}
            color={!isFilteredByPatron ? undefined : "gray.400"}
          >
            {texts.byTable}
          </Heading>
          <Divider bg={!isFilteredByPatron ? "gray.400" : "gray.300"} />
        </Pressable>
      </HStack>
      <Box pb={8} pt={4}>
        <PresenceTransition
          visible={isFilteredByPatron}
          initial={{ opacity: 0, }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250
            }
          }}>
          <ScrollView horizontal={true} pb={2}>
            <HStack space={2}>
              {tableChoosen?.users?.map((patron, index) => (
                <Tile key={patron._id} selected={false} onPress={undefined} >
                  {`${texts.person} ${index + 1}`}
                </Tile>
              ))}
            </HStack>
          </ScrollView>
        </PresenceTransition>
        <VStack space={6} pt={"5"}>
          {!tableChoosen?.orders?.length ?
            <Center flex={1} paddingY={"10"}>
              <Heading size={"md"} textAlign={"center"}>{texts.noOrdersYet}</Heading>
            </Center>
            : tableChoosen?.orders?.map((order) => {
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
        minWidth="400"
        selectedValue={status}
        placeholder={texts.orderStatus}
        accessibilityLabel={texts.chooseService}
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