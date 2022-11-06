import React from "react"
import {
  Button,
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  ScrollView
} from "native-base";
import { useRouter } from "next/router"
import { SummaryComponent } from "../../components/OrderSummary";
import { LeftSideBar } from "../../components";
import { parseToCurrency } from "../../utils";
import { UpperSection } from "../../components/UpperSection";
import { SideBySideButtons } from "../AllAndAddButons";
import { Tile } from "../../components/Tile";
import { SmallAddMoreButton } from "../../components/atoms/AddMoreButton";
import { BottomSection } from "../../components/BottomSection/BottomSection";
import { ProductTile } from "../../components/Product/Product";

const texts = {
  back: "Back",
  table: "Table",
  total: "Total",
  sendToKitchen: "Send to kitchen",
  people: "People",
  patrons: "Patrons",
}

const orders = new Array(5).fill({
  id: 2,
  name: "Ravioli a la carbonara de Queijo",
  price: 1200,
  quantity: 1,
});

const patrons = new Array(3).fill({
  id: 2,
  name: "Alexandre",
})

const categories = new Array(5).fill({
  id: 2,
  name: "Pizzas",
})

const products = new Array(10).fill({
  _id: 23,
  name: "Polenta",
  price: 2300,
  imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRfpZB0_3qGRT0vx7Jlw662goIgQc9en4esg&usqp=CAU",
})

export const AddToOrder = (props: any) => {
  const route = useRouter()
  const { orderId } = route.query

  console.log(props, orderId)

  return (
    <Flex flexDirection={"row"} flex={1}>
      <LeftSideBar>
        <Flex flex={1} pt={2} pb={4} justifyContent={""}>
          <Flex direction="row" justify="space-evenly" mb={4}>
            <Text py="2">Table 1</Text>
            <Divider orientation="vertical" mx="3" />
            <Text py="2">2 {texts.people}</Text>
          </Flex>

          <ScrollView flex={1}>
            {orders.map((order, index) =>
              <SummaryComponent
                key={order.id}
                name={order.name}
                price={order.price}
                quantity={order.quantity}
                onEditPress={() => console.log("EDIT")}
                onRemovePress={() => console.log("REMOVE")}
                onPlusPress={() => console.log("PLUS")}
                onMinusPress={() => console.log("MINUS")}
                lastItem={index === orders.length - 1}
              />)}
          </ScrollView>

          <Box w={"100%"} justifyContent={"end"} pt={2}>
            <Divider mb="3" />
            <HStack justifyContent={"space-between"} pb={2}>
              <Heading size={"md"}>{texts.total}</Heading>
              <Heading size={"md"}>{parseToCurrency(2400)}</Heading>
            </HStack>


            <VStack space={4}>
              <Button w={"full"}>
                <Text color={"white"}>{texts.sendToKitchen}</Text>
              </Button>

              <Button
                flex={1}
                p={0}
                variant="link"
                size="sm"
                colorScheme="info"
                onPress={() => console.log("REMOVE")}
                justifyContent={"end"}
              >
                {texts.back}
              </Button>

            </VStack>
          </Box>
        </Flex>
      </LeftSideBar>
      <Box flex={1}>
        <Box backgroundColor={"primary.500"} h={150} w={"100%"} position={"absolute"} zIndex={-1} />

        <VStack flex={1} p={4} space={4}>
          <UpperSection>
            <Heading>{texts.patrons}</Heading>

            <HStack space={2}>
              <SmallAddMoreButton onPress={() => console.log("Hello")} />
              <ScrollView horizontal={true} pb={2}>
                <HStack space={2}>
                  {patrons.map((patron) => (
                    <Tile key={patron._id} selected={false} onPress={undefined}>
                      {patron.name}
                    </Tile>
                  ))}
                </HStack>
              </ScrollView>
            </HStack>

            <SideBySideButtons
              leftAction={undefined}
              rightAction={undefined}
              leftText={"Close Tab"}
              rightText={"See Details"}
              leftDisabled={false}
              rightDisabled={false}
            />
          </UpperSection>


          <BottomSection>
            <HStack space={2}>

              <Heading pr={10}>Menu</Heading>
              <ScrollView horizontal={true} pb={2}>
                <HStack space={2}>
                  {categories.map((patron) => (<Tile key={patron._id} selected={false} onPress={undefined}>
                    {patron.name}
                  </Tile>))}
                </HStack>
              </ScrollView>
            </HStack>

            <ScrollView pt={2}>
              <VStack flexDir={"row"} flexWrap={"wrap"} space={4}>
                {products.map((product) => <ProductTile
                  key={product._id}
                  product={product}
                  onEdit={() => console.log("Hello")} />)}
              </VStack>
            </ScrollView>
          </BottomSection>
        </VStack>
      </Box>
    </Flex>
  )
}

