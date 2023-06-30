import { Box, Button, FlatList, Heading, HStack, Text } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { Icon } from '../../components/atoms/NavigationButton'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { FDSSelect, SelectData } from '../../components/FDSSelect'
import { GetSpacesFromBusinessDocument, GetTabRequestsDocument, RequestStatus, useAcceptTabRequestMutation, useDeclineTabRequestMutation } from '../../gen/generated'
import { useTranslation } from 'next-i18next'

type TileProps = {
  name?: string | null,
  phone?: string | null,
  people: number,
  _id: string,
  onPress1: (_id: string, selectedTable: string) => void,
  onPress2: (_id: string) => void,
  isLoading?: boolean;
  status: RequestStatus;
  array: SelectData[];
}

const refetchQueries = [{
  query: GetTabRequestsDocument, variables:
    { input: { filterBy: RequestStatus.Pending } },
},
{ query: GetSpacesFromBusinessDocument }
]

const TileRequest = ({ name,
  phone,
  people,
  onPress1,
  onPress2,
  isLoading,
  _id,
  status,
  array }: TileProps) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
  const { t } = useTranslation("businessTables")

  return (<HStack
    borderRadius={"md"}
    borderWidth={1}
    paddingY={1}
    paddingX={2}>
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
          w={"100"}
          array={array}
          placeholder={t("table")}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </HStack>
      <Text>
        {status}
      </Text>
    </Box>
    <Box flex={1} justifyContent={"center"}>
      <HStack space={2}>
        <Button
          onPress={() => {
            if (!selectedValue) return
            onPress1(_id, selectedValue)
          }}
          isLoading={isLoading}
          isDisabled={!selectedValue}
          colorScheme={"tertiary"}
          flex={1}>{t("accept")}</Button>
        <Button
          onPress={() => onPress2(_id)}
          isLoading={isLoading}
          colorScheme={"secondary"}
          flex={1}>{t("decline")}</Button>
      </HStack>
    </Box>
  </HStack>
  )
}

type RequestsModalProps = {
  isOpen: boolean,
  onClose: () => void,
  availableTables?: SelectData[];
  requests?: any[];
  isLoading?: boolean;
  subscribeToRequests?: () => void;
}


export const RequestsModal = ({
  isOpen,
  onClose,
  requests,
  isLoading,
  availableTables,
  subscribeToRequests
}: RequestsModalProps) => {
  const { t } = useTranslation("businessTables")

  const [decline, { loading: loadingDecline }] = useDeclineTabRequestMutation({ refetchQueries })
  const [accept, { loading: loadingAccept }] = useAcceptTabRequestMutation({ refetchQueries })

  const onDeclinePress = useCallback((_id: string) => {
    decline({
      variables: {
        input: {
          _id
        }
      }
    })
  }, [decline])

  const onAcceptPress = useCallback((_id: string, selectedTable: string) => {
    accept({
      variables: {
        input: {
          request: _id,
          table: selectedTable
        }
      }
    })
  }, [accept])

  useEffect(() => {
    subscribeToRequests?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CustomModal
      size={"xl"}
      isOpen={isOpen}
      onClose={onClose}
      HeaderComponent={<Heading>{t("pendingRequests")}</Heading>}
      ModalBody={
        <>
          {isLoading ? <Text>Loading</Text> : <FlatList
            data={requests}
            renderItem={({ item }) =>
              <TileRequest
                status={item.status}
                _id={item._id}
                name={item.requestor?.name || item.admin.name}
                phone={item.requestor?.phoneNumber || item.admin.phoneNumber}
                people={item.totalGuests}
                onPress1={onAcceptPress}
                onPress2={onDeclinePress}
                isLoading={loadingAccept || loadingDecline}
                array={availableTables ?? []}
              />}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <Box h={4} />}
            ListEmptyComponent={() => <Text textAlign="center">{t("noPendingRequests")}</Text>}
          />}
        </>
      }
      ModalFooter={<Button onPress={onClose} flex={1} colorScheme={"gray"}>{t("close")}</Button>}
    />
  )
}
