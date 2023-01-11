import React, { useCallback, useMemo } from "react"
import { Box, Button, Divider, FlatList, Heading, HStack, VStack } from "native-base"
import { useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { ModalFeedback } from "../../components/ModalFeedback/ModalFeedback"
import { useSpacesMutationHook } from "../../graphQL/SpaceQL"
import { AllAndEditButtons } from "../AllAndAddButons"
import { useTableMutationHook } from "../../graphQL/TableQL"
import { SquareTable } from "./SquareTable"
import { Stats } from "./Stats"
import { SpaceModal } from "./SpaceModal"
import { AddTableModal } from "./AddTableModal"
import { SelectedTable, TableModal } from "./TableModal"
import { texts } from "./texts"

export const TablesScreen = () => {
  const {
    allSpaces,
  } = useSpacesMutationHook();

  const [selectedSpaceId, setSelectedSpace] = useState<string>(allSpaces?.[0]?._id);
  const [isSpaceModalOpen, setSpaceIsModalOpen] = useState(false)
  const [tableChoosen, setTableChoosen] = useState<SelectedTable>(null)
  const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false)

  const selectedSpace = useMemo(() => allSpaces.find(space => space._id === selectedSpaceId), [allSpaces, selectedSpaceId])
  const allTables = useMemo(() => selectedSpace?.tables || [], [selectedSpace?.tables])

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
  }, [selectedSpaceId])

  const renderTables = useCallback(() => {
    return allTables.map((item, index) =>
      <SquareTable key={item._id} index={index} status={item.status} onPress={() => {
        console.log("item", item)
        setTableChoosen({
          _id: item._id,
          status: item.status,
          tableNumber: item.tableNumber,
          tab: item?.tab._id
        })
      }} />)
  }, [allTables])

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
        postNewTable={postNewTable} />
      <SpaceModal isModalOpen={isSpaceModalOpen} setIsModalOpen={setSpaceIsModalOpen} />
      <TableModal tableChoosen={tableChoosen} setTableChoosen={setTableChoosen} />
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
              allAction={undefined}
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
              {renderTables()}
            </HStack>
          </Box>

        </Box> : null

        }
      </VStack>
    </Box>
  )
}
