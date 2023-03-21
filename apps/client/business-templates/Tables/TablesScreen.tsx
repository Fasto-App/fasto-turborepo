import React, { useCallback, useState, useMemo } from "react"
import { Badge, Box, Button, Divider, FlatList, Heading, HStack, VStack } from "native-base"
import { SquareTable } from "./SquareTable"
import { Stats } from "./Stats"
import { SpaceModal } from "./SpaceModal"
import { AddTableModal } from "./AddTableModal"
import { TableModal } from "./TableModal"
import { texts } from "./texts"
import { useTableScreenStore } from "./tableScreenStore"
import { shallow } from 'zustand/shallow'
import { MoreButton } from "../../components/MoreButton"
import { useCreateTableMutation, GetSpacesFromBusinessDocument, useGetSpacesFromBusinessQuery, useGetTablesFromSpaceQuery, TableStatus, RequestStatus, useGetTabRequestsQuery } from "../../gen/generated"
import { useAppStore } from "../UseAppStore"
import { RequestsModal } from "./RequestsModal"
import { BottomSection } from "../../components/BottomSection"
import { UpperSection } from "../../components/UpperSection"
import { Tile } from "../../components/Tile"
import { OrangeBox } from "../../components/OrangeBox"

export const TablesScreen = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  const { selectedSpaceId,
    isNewTableModalOpen,
    setIsNewTableModalOpen,
    isSpaceModalOpen,
    setSelectedSpace,
    setTableChoosen,
    setSpaceIsModalOpen
  } = useTableScreenStore(
    state => ({
      tableChoosen: state.tableChoosen,
      selectedSpaceId: state.selectedSpaceId,
      isNewTableModalOpen: state.isNewTableModalOpen,
      setIsNewTableModalOpen: state.setIsNewTableModalOpen,
      setSelectedSpace: state.setSelectedSpace,
      isSpaceModalOpen: state.isSpaceModalOpen,
      setTableChoosen: state.setTableChoosen,
      setSpaceIsModalOpen: state.setSpaceIsModalOpen
    }),
    shallow
  )

  const setNetworkState = useAppStore(state => state.setNetworkState)

  // todo: get all the spaces and default to the first one
  // const { allSpaces } = useSpacesMutationHook(setSelectedSpace);
  const { data } = useGetSpacesFromBusinessQuery({
    onCompleted: (data) => {
      setSelectedSpace?.(data.getSpacesFromBusiness?.[0]._id)
    },
  });

  // use reduce
  const allTables = useMemo(() => {
    return data?.getSpacesFromBusiness?.reduce((acc, space) => {
      if (space._id !== selectedSpaceId) return acc

      return space.tables
    }, [] as {
      __typename?: "Table" | undefined;
      _id: string;
      status: TableStatus;
      tableNumber: string;
      tab?: string | null | undefined;
    }[] | undefined | null)
  }, [data?.getSpacesFromBusiness, selectedSpaceId])

  const availableTables = useMemo(() => {
    return allTables?.
      filter(table => table.status === TableStatus.Available).
      map(table => table._id)
  }, [allTables])

  const [createTable] = useCreateTableMutation({
    refetchQueries: [{ query: GetSpacesFromBusinessDocument }],
    onCompleted: () => {
      setNetworkState(("success"))
    },
    onError: () => {
      setNetworkState(("error"))
    }
  });

  const { data: pendingRequestsData, loading: pendingResquestLoading } = useGetTabRequestsQuery({
    variables: {
      input: {
        filterBy: RequestStatus.Pending
      }
    }
  })

  const postNewTable = async () => {

    if (!selectedSpaceId) return;

    await createTable({
      variables: {
        input: { space: selectedSpaceId },
      },
    })
  }

  const renderSpaces = useCallback(({ item }) => {
    return (
      <Tile
        selected={selectedSpaceId === item._id}
        onPress={() => setSelectedSpace(item._id)}
      >
        {item.name}
      </Tile>
    )
  }, [selectedSpaceId, setSelectedSpace])

  return (
    <Box flex={1}>
      <AddTableModal
        isModalOpen={isNewTableModalOpen}
        setIsModalOpen={setIsNewTableModalOpen}
        postNewTable={postNewTable}
      />
      <SpaceModal
        isModalOpen={isSpaceModalOpen}
        setIsModalOpen={setSpaceIsModalOpen}
      />
      <TableModal />
      <RequestsModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        availableTables={availableTables}
        requests={pendingRequestsData?.getTabRequests}
        isLoading={pendingResquestLoading}
      />
      <OrangeBox height={150} />
      <VStack m={"4"} space={"4"} flex={1}>
        <UpperSection>

          <Heading>
            {texts.space}
          </Heading>

          <HStack space={2} mt={2}>
            <MoreButton onPress={() => setSpaceIsModalOpen(true)} />
            <FlatList
              horizontal
              data={data?.getSpacesFromBusiness}
              renderItem={renderSpaces}
              ItemSeparatorComponent={() => <Box w={4} />}
              keyExtractor={(item, index) => `${item?._id}-${index}`}
            />
            <Divider orientation="vertical" />
            <Stats />
          </HStack>
        </UpperSection>
        {selectedSpaceId ?
          <BottomSection>
            <Box flex={1} >
              <HStack space={32} pb={"6"}>
                <Heading>{texts.tables}</Heading>
                <ButtonWithBadge
                  onPress={() => setIsRequestModalOpen(true)}
                  badgeCount={pendingRequestsData?.getTabRequests.length}>
                  {texts.requests}
                </ButtonWithBadge>
              </HStack>
              <HStack flexDir={"row"} flexWrap={"wrap"} space={4}>
                <SquareTable isButton={true} onPress={() => setIsNewTableModalOpen(true)} />
                {allTables?.map((table, index) =>
                  <SquareTable
                    key={table?._id}
                    index={index}
                    status={table?.status}
                    tableNumber={table?.tableNumber}
                    onPress={() => setTableChoosen(table._id)} />)}
              </HStack>
            </Box>
          </BottomSection> : null}
      </VStack>
    </Box>
  )
}

type ButtonWithBadgeProps = {
  onPress: () => void;
  children: React.ReactNode;
  badgeCount?: number;
}
const ButtonWithBadge = ({ onPress, children, badgeCount }: ButtonWithBadgeProps) => {
  return (<Box>
    {badgeCount ? <Badge
      colorScheme="danger"
      rounded="full"
      mb={-4}
      mr={-2}
      zIndex={1}
      variant="solid" alignSelf="flex-end">
      {badgeCount}
    </Badge> : null}
    <Button w={"48"} colorScheme={"tertiary"} onPress={onPress}>
      {children}
    </Button>
  </Box>
  )
}
