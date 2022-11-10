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
import { Product, useCreateMultipleOrderDetailsMutation, useGetMenuByIdQuery, useGetTabByIdQuery } from "../../gen/generated";
import { ModalFeedback } from "../../components/ModalFeedback/ModalFeedback";

const texts = {
  back: "Back",
  table: "Table",
  total: "Total",
  sendToKitchen: "Send to kitchen",
  people: "People",
  patrons: "Patrons",
}

type NewOrder = Product & { quantity: number, selectedUser?: string }

export const AddToOrder = (props: any) => {
  const route = useRouter()
  const { tabId, menuId } = route.query
  const [orderItems, setOrderItems] = React.useState<NewOrder[]>([])
  const [selectedUser, setSelectedUser] = React.useState<string | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined)

  const { data: menuData } = useGetMenuByIdQuery({
    variables: {
      input: {
        id: menuId as string,
      }
    },
    onCompleted: (data) => {
      if (data?.getMenuByID?.sections?.[0].category._id) {
        setSelectedCategory(data?.getMenuByID?.sections?.[0].category._id)
      }
    },
  })

  const { data: tabData } = useGetTabByIdQuery({
    variables: {
      input: {
        _id: tabId as string,
      }
    },
  })

  const [createOrders, { data }] = useCreateMultipleOrderDetailsMutation()

  const onSendToKitchen = async () => {
    const orderDetails = orderItems.map(order => ({
      user: order.selectedUser,
      tab: tabId as string,
      product: order._id,
      quantity: order.quantity,
      message: "",
    }))

    try {
      await createOrders({
        variables: {
          input: orderDetails,
        }
      })
    } catch { }

  }

  const sections = menuData?.getMenuByID?.sections || []
  const filteredSection = sections.find(section => section.category._id === selectedCategory)
  const products = filteredSection?.products || []
  const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (

    <>
      <ModalFeedback isOpen={!!data} onClose={() => route.back()} />
      <Flex flexDirection={"row"} flex={1}>
        <LeftSideBar>
          <Flex flex={1} pt={2} pb={4} justifyContent={""}>
            <Flex direction="row" justify="space-evenly" mb={4}>
              <Text py="2">Table 1</Text>
              <Divider orientation="vertical" mx="3" />
              <Text py="2">2 {texts.people}</Text>
            </Flex>
            <ScrollView flex={1}>
              {orderItems?.map((order, index) => {
                const personindex = tabData?.getTabByID?.users.findIndex(userId => userId === order.selectedUser)


                return <SummaryComponent
                  key={order._id}
                  name={order.name}
                  price={order.price}
                  quantity={order.quantity}
                  onEditPress={() => console.log("EDIT")}
                  onRemovePress={() => {
                    const newOrderItems = orderItems.filter((_, orderIndex) => index !== orderIndex)
                    setOrderItems(newOrderItems)
                  }}
                  onPlusPress={() => {
                    const newOrderItems = orderItems.map((item, orderIndex) => {
                      if (index === orderIndex) {
                        return {
                          ...item,
                          quantity: item.quantity + 1
                        }
                      }
                      return item
                    })
                    setOrderItems(newOrderItems)
                  }}
                  onMinusPress={() => {
                    if (order.quantity === 1) {
                      const newOrderItems = orderItems.filter((_, orderIndex) => index !== orderIndex)
                      setOrderItems(newOrderItems)
                      return
                    }

                    const newOrderItems = orderItems.map((item, orderIndex) => {
                      if (index === orderIndex && item.quantity > 1) {
                        return {
                          ...item,
                          quantity: item.quantity - 1
                        }
                      }
                      return item
                    })
                    setOrderItems(newOrderItems)
                  }}
                  lastItem={index === orderItems.length - 1}
                  selectedUser={personindex !== -1 ? `Person ${personindex + 1}` : undefined}
                />
              })}
            </ScrollView>
            <Box w={"100%"} justifyContent={"end"} pt={2}>
              <Divider mb="3" />
              <HStack justifyContent={"space-between"} pb={2}>
                <Heading size={"md"}>{texts.total}</Heading>
                <Heading size={"md"}>{parseToCurrency(total)}</Heading>
              </HStack>
              <VStack space={4}>
                <Button w={"full"} onPress={onSendToKitchen} isDisabled={orderItems.length <= 0} >
                  <Text color={"white"}>{texts.sendToKitchen}</Text>
                </Button>
                <Button
                  flex={1}
                  p={0}
                  variant="link"
                  size="sm"
                  colorScheme="info"
                  onPress={() => route.back()}
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
                    <Tile
                      selected={!selectedUser}
                      onPress={() => setSelectedUser(null)}
                    >
                      {`Table`}
                    </Tile>
                    {tabData?.getTabByID?.users.map((user, index) => (
                      <Tile
                        key={user}
                        selected={user === selectedUser}
                        onPress={() => setSelectedUser(user)}
                      >
                        {`Person ${index + 1}`}
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
                    {sections.map((section) => (
                      <Tile
                        key={section.category._id}
                        selected={section.category._id === selectedCategory}
                        onPress={() => setSelectedCategory(section.category._id)}>
                        {section.category.name}
                      </Tile>))}
                  </HStack>
                </ScrollView>
              </HStack>
              <ScrollView pt={2}>
                <VStack flexDir={"row"} flexWrap={"wrap"} space={4}>
                  {products.map((product) => (<ProductTile
                    key={product._id}
                    product={product}
                    onEdit={() => {
                      const findIndex = orderItems.findIndex(order => (
                        order._id === product._id && order?.selectedUser === selectedUser)
                      )

                      if (findIndex >= 0) {
                        const newOrder = {
                          ...orderItems[findIndex],
                          quantity: orderItems[findIndex].quantity + 1,
                          selectedUser
                        }

                        const newArray = orderItems.map((order, index) => index === findIndex ? newOrder : order)

                        setOrderItems(newArray)
                        return
                      }

                      setOrderItems([...orderItems, { ...product, quantity: 1, selectedUser }])
                    }} />
                  ))}
                </VStack>
              </ScrollView>
            </BottomSection>
          </VStack>
        </Box>
      </Flex>
    </>
  )
}

