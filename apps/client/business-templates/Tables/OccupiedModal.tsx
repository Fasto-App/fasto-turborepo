import React, { useState } from "react"
import { Box, Center, CheckIcon, Heading, HStack, Select, VStack, Text, Image, Pressable, Divider } from "native-base"
import { Tile } from "../../components/Tile"
import { OrderStatus } from "../../gen/generated"
import { parseToCurrency } from "../../utils"


const patrons = new Array(3).fill({
  id: 2,
  name: "Alexandre",
});

const orders = new Array(3).fill({
  id: "1",
  name: "Pizza de Catupiry com Borda",
  image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F19%2F2022%2F05%2F09%2Fbacon-509429382.jpg&q=60",
  price: 1000,
  quantity: 2,
  status: "DELIVERED",
})

enum FilterOrderBy {
  "Patron",
  "Table",
}

export const OccupiedModal = () => {
  const [tabOpen, setTabOpen] = useState<FilterOrderBy>()
  return (
    <Box>
      <HStack flex={1} justifyContent={"space-around"}>
        <Pressable flex={1} onPress={() => setTabOpen(FilterOrderBy.Patron)}>
          <Heading size={"md"} textAlign={"center"}>{"By Patron"}</Heading>
          <Divider />
        </Pressable>
        <Pressable flex={1} onPress={() => setTabOpen(FilterOrderBy.Table)}>
          <Heading size={"md"} textAlign={"center"}>{"By Table"}</Heading>
          <Divider />
        </Pressable>
      </HStack>
      <Box p={8}>
        <HStack space={2} pb={10}>
          {patrons.map((patron) => (
            <Tile children={patron.name} selected={false} onPress={undefined} />
          ))}
        </HStack>
        {<VStack space={6}>
          {orders.map((order) => <OrderTile order={order} />)}
        </VStack>}
      </Box>
    </Box>
  )
}

const OrderTile = ({ order }) => {
  return (<HStack borderRadius={"md"} p={1} backgroundColor={"white"} flex={1} justifyContent={"space-between"}>
    <HStack>
      <Center>
        <Image src={"https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F19%2F2022%2F05%2F09%2Fbacon-509429382.jpg&q=60"}
          width={100} height={60}
        />
      </Center>
      <VStack pl={2} pt={3}>
        <Heading size={"sm"}>{`${order.name}`}</Heading>
        <Text>{`${parseToCurrency(order.price)}`}</Text>
      </VStack>
    </HStack>

    <Center>
      <Select selectedValue={"DELIVERED"} minWidth="200" accessibilityLabel="Choose Service" placeholder="Order Status" mt={1} onValueChange={itemValue => console.log(itemValue)}>
        {Object.keys(OrderStatus).map((status) => (
          <Select.Item label={status} value={status.toUpperCase()} />)
        )}
      </Select>
    </Center>
    <Center>
      <Text>{`${parseToCurrency(order.price * order.quantity)}`}</Text>
    </Center>
    <Center>
      <Text >{`${order.quantity}x`}</Text>
    </Center>
    <Center p={6}>
      <CheckIcon />
    </Center>
  </HStack>)
}