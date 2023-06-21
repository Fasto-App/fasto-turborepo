import React, { useCallback, useState, useMemo } from "react"
import { Badge, Box, Button, Divider, FlatList, Heading, HStack, Pressable, ScrollView, VStack } from "native-base"
import { SquareTable } from "./SquareTable"
import { Stats } from "./Stats"
import { SpaceModal } from "./SpaceModal"
import { AddTableModal } from "./AddTableModal"
import { NewTabModal, OccupiedTabModal } from "./TableModal"
import { useTableScreenStore } from "./tableScreenStore"
import { shallow } from 'zustand/shallow'
import { MoreButton } from "../../components/MoreButton"
import { useCreateTableMutation, GetSpacesFromBusinessDocument, useGetSpacesFromBusinessQuery, TableStatus, RequestStatus, useGetTabRequestsQuery, OnTabRequestDocument } from "../../gen/generated"
import { useAppStore } from "../UseAppStore"
import { RequestsModal } from "./RequestsModal"
import { BottomSection } from "../../components/BottomSection"
import { UpperSection } from "../../components/UpperSection"
import { Tile, TileLoading } from "../../components/Tile"
import { OrangeBox } from "../../components/OrangeBox"
import { useTranslation } from "next-i18next"

export const TablesScreen = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  const [newTableModalData, setNewTableModalData] = useState({
    isOpen: false,
    tableId: "",
  })

  const [occupiedTabModalData, setOccupiedModalData] = useState({
    isOpen: false,
    tabId: "",
  })

  const [addNewTableModalOpen, setAddNewTableModalOpen] = useState(false)

  const { selectedSpaceId,
    isSpaceModalOpen,
    setSelectedSpace,
    setSpaceIsModalOpen,
  } = useTableScreenStore(
    state => ({
      selectedSpaceId: state.selectedSpaceId,
      setSelectedSpace: state.setSelectedSpace,
      isSpaceModalOpen: state.isSpaceModalOpen,
      setSpaceIsModalOpen: state.setSpaceIsModalOpen
    }),
    shallow
  )

  const setNetworkState = useAppStore(state => state.setNetworkState)

  const { t } = useTranslation("businessTables")

  const { data, loading: spaceLoading } = useGetSpacesFromBusinessQuery({
    onCompleted: (data) => {
      if (!selectedSpaceId) {
        setSelectedSpace?.(data.getSpacesFromBusiness?.[0]._id)
      }
    },
  });

  // use reduce
  const allTablesFromSpace = useMemo(() => {
    return data?.getSpacesFromBusiness?.reduce((acc, space) => {
      if (space._id !== selectedSpaceId) return acc

      return space.tables
    }, [] as {
      __typename?: "Table" | undefined;
      _id: string;
      status: TableStatus;
      tableNumber: string;
      tab?: { __typename?: "Tab" | undefined; _id: string; } | null | undefined;
    }[] | undefined | null)
  }, [data?.getSpacesFromBusiness, selectedSpaceId])

  const availableTables = useMemo(() => {
    return allTablesFromSpace?.reduce((acc, table) => {

      if (table.status === TableStatus.Available) {
        acc.push({ _id: table._id, value: table.tableNumber })
      }

      return acc
    }, [] as { _id: string, value: string }[])
  }, [allTablesFromSpace])

  const [createTable] = useCreateTableMutation({
    refetchQueries: [{ query: GetSpacesFromBusinessDocument }],
    onCompleted: () => {
      setNetworkState(("success"))
    },
    onError: () => {
      setNetworkState(("error"))
    }
  });

  const { data: pendingRequestsData,
    loading: pendingResquestLoading,
    subscribeToMore: subscribeToMoreRequests
  } = useGetTabRequestsQuery({
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

  const occupiedTables = useMemo(() => {
    return allTablesFromSpace?.filter(table => table.status === TableStatus.Occupied)
  }, [allTablesFromSpace])

  return (
    <>
      <Box flex={1}>
        <AddTableModal
          isModalOpen={addNewTableModalOpen}
          setIsModalOpen={setAddNewTableModalOpen}
          postNewTable={postNewTable}
        />
        <SpaceModal
          isModalOpen={isSpaceModalOpen}
          setIsModalOpen={setSpaceIsModalOpen}
        />
        <RequestsModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          availableTables={availableTables}
          requests={pendingRequestsData?.getTabRequests}
          isLoading={pendingResquestLoading}
          subscribeToRequests={() => {
            subscribeToMoreRequests({
              document: OnTabRequestDocument,
              variables: {
                input: {
                  filterBy: RequestStatus.Pending
                }
              },
              updateQuery: (prev, { subscriptionData }) => {

                console.log("prev", prev)
                console.log("subscriptionData", subscriptionData)

                if (!subscriptionData.data) return prev;


                console.log("subscriptionData.data.onTabRequest", subscriptionData.data)
                // @ts-ignore
                const newRequest = subscriptionData.data.onTabRequest;

                return {
                  ...prev,
                  getTabRequests: [...prev.getTabRequests, newRequest]
                }
              }
            })
          }}
        />
        <OrangeBox />
        <VStack m={"4"} space={"4"} flex={1}>
          <UpperSection>
            <HStack flex={1} space={2} mt={2} justifyContent={"space-between"}>
              <VStack space="2">
                <Heading>
                  {t("space")}
                </Heading>

                <HStack flex={1} space={4}>
                  <MoreButton onPress={() => setSpaceIsModalOpen(true)} />
                  {spaceLoading ? <TileLoading /> : (
                    <FlatList
                      horizontal
                      data={data?.getSpacesFromBusiness}
                      renderItem={renderSpaces}
                      ItemSeparatorComponent={() => <Box w={4} />}
                      keyExtractor={(item, index) => `${item?._id}-${index}`}
                    />)}
                </HStack>
              </VStack>

              <Stats
                Available={availableTables?.length || 0}
                Occupied={occupiedTables?.length || 0}
                Reserved={0}
                Closed={0}
              />
            </HStack>
          </UpperSection>
          {selectedSpaceId ?
            <BottomSection>
              <Box flex={1} >
                <HStack space={30} pb={"6"}>
                  <Heading alignSelf={"center"}>{t("tables")}</Heading>
                  <ButtonWithBadge
                    onPress={() => setAddNewTableModalOpen(true)}
                    badgeCount={pendingRequestsData?.getTabRequests.length}>
                    {t("requests")}
                  </ButtonWithBadge>
                </HStack>
                <ScrollView>
                  <HStack flexDir={"row"} flexWrap={"wrap"} space={4}>
                    <SquareTable isButton={true} onPress={() => {
                      console.log("new table", true)
                      setAddNewTableModalOpen(true)
                    }} />
                    {allTablesFromSpace?.map((table, index) =>
                      <SquareTable
                        key={table._id}
                        index={index}
                        status={table?.status}
                        tableNumber={table?.tableNumber}
                        onPress={() => {
                          // this should be the id of the tab if the table is occupied,
                          // otherwise it opens the new Table Modal
                          if (table?.tab?._id) {
                            setOccupiedModalData({
                              tabId: table?.tab?._id,
                              isOpen: true
                            })

                            return;
                          }

                          setNewTableModalData({
                            tableId: table._id,
                            isOpen: true
                          })

                        }}
                      />
                    )}
                  </HStack>
                </ScrollView>
              </Box>
            </BottomSection> : null}
        </VStack>
      </Box>
      <OccupiedTabModal
        tabId={occupiedTabModalData.tabId}
        setIsModalOpen={() => setOccupiedModalData({ isOpen: false, tabId: "" })}
      />
      <NewTabModal tableId={newTableModalData.tableId}
        setIsModalOpen={() => setNewTableModalData({ isOpen: false, tableId: "" })}
      />
    </>
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
