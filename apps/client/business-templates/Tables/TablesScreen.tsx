import React, { useCallback, useMemo } from "react"
import { Box, Button, Divider, FlatList, Heading, HStack, VStack } from "native-base"
import { AiOutlinePlus } from "react-icons/ai"
import { ModalFeedback } from "../../components/ModalFeedback/ModalFeedback"
import { useSpacesMutationHook } from "../../graphQL/SpaceQL"
import { AllAndEditButtons } from "../AllAndAddButons"
import { useTableMutationHook } from "../../graphQL/TableQL"
import { SquareTable } from "./SquareTable"
import { Stats } from "./Stats"
import { SpaceModal } from "./SpaceModal"
import { AddTableModal } from "./AddTableModal"
import { TableModal } from "./TableModal"
import { texts } from "./texts"
import { useTableScreenStore } from "./tableScreenStore"
import { shallow } from 'zustand/shallow'

export const TablesScreen = () => {

  const { selectedSpaceId,
    isNewTableModalOpen,
    setIsNewTableModalOpen,
    isSpaceModalOpen,
    setSelectedSpace,
    tableChoosen,
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

  const {
    allSpaces,
  } = useSpacesMutationHook(setSelectedSpace);

  const selectedSpace = useMemo(() => allSpaces.find(space => space._id === selectedSpaceId), [allSpaces, selectedSpaceId])
  const allTablesFilteredBySpace = useMemo(() => selectedSpace?.tables || [], [selectedSpace?.tables])

  const { createTable } = useTableMutationHook();
  const postNewTable = async () => {
    await createTable({
      variables: {
        input: { space: selectedSpaceId },
      }
    })
  }

  const renderSpaces = useCallback(({ item }) => {
    const selected = selectedSpaceId === item._id
    return (
      <Button
        px={4}
        m={0}
        minW={"100px"}
        maxH={"40px"}
        borderColor={selected ? 'primary.500' : "gray.300"}
        disabled={selected}
        variant={selected ? 'outline' : 'outline'}
        colorScheme={selected ? "primary" : "black"}
        onPress={() => setSelectedSpace(item._id)}
      >
        {item.name}
      </Button>
    )
  }, [selectedSpaceId, setSelectedSpace])

  return (
    <Box flex={1}>
      <ModalFeedback
        isWarning={false}
        isOpen={false}
        onClose={() => console.log("close")}
      />
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
      <Box backgroundColor={"primary.500"} h={150} w={"100%"} position={"absolute"} zIndex={-1} />
      <VStack m={"4"} space={"4"} flex={1}>
        <VStack
          p={"4"}
          space={"2"}
          shadow={"4"}
          borderWidth={1}
          borderRadius={"md"}
          borderColor={"trueGray.400"}
          backgroundColor={"white"}
          flexDirection={"column"}
        >

          <Heading>
            {texts.space}
          </Heading>

          <HStack space={2} mt={2}>
            <Button
              maxH={"40px"}
              borderWidth={1}
              colorScheme="primary"
              variant={"outline"}
              onPress={() => setSpaceIsModalOpen(true)}>
              <Box borderWidth={1} borderRadius={'full'} justifyContent="center" alignItems={"center"} >
                <AiOutlinePlus size={"1em"} />
              </Box>
            </Button>
            <FlatList
              horizontal
              data={allSpaces}
              renderItem={renderSpaces}
              ItemSeparatorComponent={() => <Box w={4} />}
              keyExtractor={(item) => item._id}
            />

            <Divider orientation="vertical" />
            <Stats />
          </HStack>
          <Box>
            <AllAndEditButtons
              allAction={() => console.log("All")}
              editAction={(edit) => console.log("Edit", edit)}
              categoryId={selectedSpaceId} />
          </Box>

        </VStack>

        {selectedSpaceId ? <Box
          p={"4"}
          flex={1}
          borderWidth={1}
          borderRadius={"md"}
          borderColor={"trueGray.400"}
          backgroundColor={"white"}
          overflow={"scroll"}
        >
          <Box flex={1}>
            <HStack flexDir={"row"} flexWrap={"wrap"} space={4}>
              <SquareTable isButton={true} onPress={() => setIsNewTableModalOpen(true)} />
              {allTablesFilteredBySpace.map((table, index) =>
                <SquareTable key={table._id} index={index} status={table.status} onPress={() => {
                  setTableChoosen({
                    _id: table._id,
                    status: table.status,
                    tableNumber: table.tableNumber,
                    tab: table?.tab?._id,
                    orders: table.tab?.orders ?? [],
                    users: table?.tab?.users ?? []
                  })
                }} />)}
            </HStack>
          </Box>

        </Box> : null
        }
      </VStack>
    </Box>
  )
}
