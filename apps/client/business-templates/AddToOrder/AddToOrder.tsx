import { Box, Container, HStack, Icon, IconButton, Text } from "native-base"
import { useRouter } from "next/router"
import React from "react"

const SummaryComponent = () => (
  <Box w={300} borderWidth={1}>

    <HStack justifyContent={"space-between"} p={2}>
      <Text>Product Name</Text>
      <Text>Delete</Text>
    </HStack>

    <HStack>

      <HStack>
        <IconButton colorScheme="indigo" icon={<Icon name="add" />} />
        {1}
        <IconButton colorScheme="indigo" icon={<Icon name="add" />} />
      </HStack>


      <HStack justifyContent={"space-between"} borderWidth={1} flex={1}>
        <Text>Extras</Text>
        <Text>$12.00</Text>
      </HStack>

    </HStack>
  </Box>
)

export const AddToOrder = (props) => {
  const route = useRouter()
  const { orderId } = route.query
  // show all products and categories
  // fetch the tab with that order id

  return (
    <Container height={"100vh"}>
      <SummaryComponent />
      <SummaryComponent />
      <SummaryComponent />
      <SummaryComponent />
    </Container>
  )
}

