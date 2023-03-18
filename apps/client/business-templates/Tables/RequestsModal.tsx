import { Box, Button, FlatList, Heading, HStack, Text } from 'native-base'
import React from 'react'
import { Icon } from '../../components/atoms/NavigationButton'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { texts } from './texts'

const requests: {
  name: string,
  phone: string,
  people: number
}[] = new Array(1).fill({
  name: "Alex Mendes Barreto",
  phone: "+9173303561",
  people: 8,
})

const TileRequest = ({ name, phone, people }: { name: string, phone: string, people: number }) => {
  return (<HStack borderRadius={"md"} borderWidth={1} paddingY={1} paddingX={2}>
    <Box flex={1}>
      <Text fontSize={"20"}>{name}</Text>
      <HStack alignItems={"center"} space={1}>
        <Icon type={"Phone"} size={"1.3em"} />
        <Text fontSize={"16"}>{phone}</Text>
      </HStack>
      <HStack alignItems={"center"} space={2}>
        <Icon type={"People"} size={"1.3em"} />
        <Text fontSize={"20"}>{people}</Text>
      </HStack>
    </Box>
    <HStack p={6} flex={1} space={2}>
      <Button colorScheme={"tertiary"} flex={1}>{texts.accept}</Button>
      <Button colorScheme={"secondary"} flex={1}>{texts.decline}</Button>
    </HStack>
  </HStack>
  )
}


export const RequestsModal = () => {
  return (
    <CustomModal
      isOpen={true}
      onClose={() => console.log("closing modal")}
      HeaderComponent={<Heading>Pending Requests</Heading>}
      ModalBody={
        <FlatList
          data={requests}
          renderItem={({ item }) => <TileRequest {...item} />}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Box h={4} />}
        />
      }
      ModalFooter={
        <Button flex={1} colorScheme={"gray"}>Close</Button>
      }
    />
  )
}
