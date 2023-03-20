import { Box, Button, FlatList, Heading, HStack, Text } from 'native-base'
import React, { useState } from 'react'
import { Icon } from '../../components/atoms/NavigationButton'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { FDSSelect } from '../../components/FDSSelect'
import { RequestStatus, useAcceptTabRequestMutation, useDeclineTabRequestMutation, useGetTabRequestsQuery } from '../../gen/generated'
import { texts } from './texts'

type TileProps = {
  name: string,
  phone?: string | null,
  people: number,
  _id: string,
  onPress1: (_id: string, selectedTable: string) => void,
  onPress2: (_id: string) => void,
  isLoading?: boolean;
  status: RequestStatus
}

const TileRequest = ({ name, phone, people, onPress1, onPress2, isLoading, _id, status }: TileProps) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)

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
        <FDSSelect
          array={["1", "2", "3"]}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </HStack>
      <Text>
        {status}
      </Text>
    </Box>
    <HStack p={6} space={2} w={"50%"}>
      <Button
        onPress={() => {
          if (!selectedValue) return
          onPress1(_id, selectedValue)
        }}
        isLoading={isLoading}
        isDisabled={!selectedValue}
        colorScheme={"tertiary"}
        flex={1}>{texts.accept}</Button>
      <Button
        onPress={() => onPress2(_id)}
        isLoading={isLoading}
        colorScheme={"secondary"}
        flex={1}>{texts.decline}</Button>
    </HStack>
  </HStack>
  )
}


export const RequestsModal = () => {

  const { data } = useGetTabRequestsQuery({
    variables: {
      input: {
        filterBy: RequestStatus.Pending
      }
    }
  })
  const requests = data?.getTabRequests

  const [decline, { loading: loadingDecline }] = useDeclineTabRequestMutation({
    refetchQueries: ["GetTabRequests"]
  })
  const [accept, { loading: loadingAccept }] = useAcceptTabRequestMutation({
    refetchQueries: ["GetTabRequests"]
  })

  const onDeclinePress = (_id: string) => {
    decline({
      variables: {
        input: {
          _id
        }
      }
    })
  }

  const onAcceptPress = (_id: string, selectedTable: string) => {
    accept({
      variables: {
        input: {
          request: _id,
          table: selectedTable
        }
      }
    })
  }

  console.log(requests)

  return (
    <CustomModal
      isOpen={true}
      onClose={() => console.log("closing modal")}
      HeaderComponent={<Heading>Pending Requests</Heading>}
      ModalBody={
        <FlatList
          data={requests}
          renderItem={({ item }) =>
            <TileRequest
              status={item.status}
              _id={item._id}
              name={item.admin.name}
              phone={item.admin.phoneNumber}
              people={item.totalGuests}
              onPress1={onAcceptPress}
              onPress2={onDeclinePress}
              isLoading={loadingAccept || loadingDecline}
            />}
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
