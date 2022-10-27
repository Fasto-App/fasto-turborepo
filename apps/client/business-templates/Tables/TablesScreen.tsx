import React from "react"
import { Box, Button, Divider, FlatList, Heading, HStack, Text, VStack, Modal, Center, Badge } from "native-base"
import { useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { typedKeys } from "../../authUtilities/utils"
import { ControlledForm } from "../../components/ControlledForm/ControlledForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pressable } from "react-native"
import { add, format } from 'date-fns'
import { ModalFeedback } from "../../components/ModalFeedback/ModalFeedback"
import { useSpacesMutationHook } from "../../graphQL/SpaceQL"
import { AllAndEditButtons } from "../AllAndAddButons"
import { businessRoute } from "../../routes"
import { useRouter } from "next/router"
import { useTableMutationHook } from "../../graphQL/TableQL"
import { Table, TableStatus } from "../../gen/generated"
import { DevTool } from "@hookform/devtools";
// import add from "date-fns/fp/add"

const texts = {
  space: "Space"
}

const occupied = {
  status: "occupied" as TableStatus,
  ocuppant: {
    name: "John Doe",
    phone: "9173303561"
  }
} as const

const available = {
  status: "available" as TableStatus
}

const reserved = {
  status: "reserved" as TableStatus,
  reservation: {
    id: "1",
    name: "John Doe",
    email: "",
    phone: "1234567890",
    start: add(new Date(), {
      minutes: 60,
    }),
  }
}

const tablesOccupied = new Array<typeof occupied>(5).fill(occupied)
const tablesAvailable = new Array<typeof available>(7).fill(available)
const tablesReserved = new Array<typeof reserved>(3).fill(reserved)
// const allTables = [...tablesOccupied, ...tablesAvailable, ...tablesReserved].sort(() => .5 - Math.random())

export const TablesScreen = ({ allSpaces }) => {
  const [selectedSpaceId, setSelectedSpace] = useState<string>(allSpaces?.[0]?._id);
  const [isSpaceModalOpen, setSpaceIsModalOpen] = useState(false)
  const [tableChoosen, setTableChoosen] = useState<Table>(null)
  const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false)

  const selectedSpace = allSpaces.find(space => space._id === selectedSpaceId)
  const allTables = selectedSpace?.tables || []

  const { createTable } = useTableMutationHook();
  const postNewTable = async () => {
    await createTable({
      variables: {
        input: { space: selectedSpaceId },
      }
    })
  }

  const renderSpaces = ({ item }) => {
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
  }

  const renderTables = () => {

    return allTables.map((item, index) =>
      <SquareTable key={index} index={index} status={item.status} onPress={() => {
        setTableChoosen({
          _id: index,
          ...item,
        })
      }} />)
  }

  return (
    <>
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
    </>
  )
}

type statStruct = {
  number: number,
  name: TableStatus,
}

const stats: Record<TableStatus, statStruct> = {
  OCCUPIED: {
    number: 1,
    name: TableStatus.Occupied
  },
  RESERVED: {
    number: 1,
    name: TableStatus.Reserved
  },
  AVAILABLE: {
    number: 1,
    name: TableStatus.Available
  },
  CLOSED: {
    number: 1,
    name: TableStatus.Closed
  }
}

const borderColor = (status: TableStatus) => {
  switch (status) {
    case "OCCUPIED":
      return "primary.600"
    case "RESERVED":
      return "muted.300"
    case "AVAILABLE":
      return "success.600"
    default:
      return "tertiary.600"
  }
}

const badgeScheme = (status: TableStatus) => {
  switch (status) {
    case "OCCUPIED":
      return "danger"
    case "RESERVED":
      return "coolGray"
    case "AVAILABLE":
      return "success"
    default:
      return "coolGray"
  }
}

const Stats = () => (
  <HStack space={4} mr={8}>
    <Heading size={"md"} alignSelf={"center"}>TABLES</Heading>
    <VStack >
      {typedKeys(stats).map(stat =>
        <Text flex={1} key={stat} color={borderColor(stat)}>
          {stats[stat].name}
        </Text>
      )}
    </VStack>
    <VStack >
      {typedKeys(stats).map(key =>
        <Text flex={1} key={key}>
          {stats[key].number}
        </Text>
      )}
    </VStack>
  </HStack>
)

const SquareTable = ({ index, status, onPress, isButton = false }:
  { index?: number, status?: TableStatus, onPress: () => void, isButton?: boolean }) => {

  return (
    <Pressable
      onPress={onPress}
    >
      <Box
        h={"48"}
        w={"48"}
        mb={4}
        borderWidth={isButton ? 1 : 4}
        borderRadius={"md"}
        justifyContent="center"
        alignItems={"center"}
        borderColor={isButton ? "muted.500" : borderColor(status)}
      >
        {isButton ?
          <Center size={16} borderWidth={3} borderRadius={"full"}>
            <AiOutlinePlus size={"5em"} />
          </Center>
          :
          <Heading color={borderColor(status)}>
            {index + 1}
          </Heading>}
      </Box>
    </Pressable>)
}

const SpaceModal = ({ isModalOpen, setIsModalOpen }) => {
  const {
    control,
    formState,
    clearErrors,
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      space_name: "",
    },
    resolver: zodResolver(z.object({
      space_name: z.string().min(2, "Please, enter a Space Name. Min 2 chars").max(15, "15 characters max")
    }))
  })

  const {
    createSpace,
  } = useSpacesMutationHook();

  const onSubmit = async (data) => {
    setIsModalOpen(false)

    await createSpace(
      {
        variables: {
          input: { name: data.space_name, }
        }
      }
    )
    reset()
  }

  const onCancel = () => {
    setIsModalOpen(false)
    reset()
    clearErrors()
  }

  return <Modal isOpen={isModalOpen} onClose={onCancel}>
    <Modal.CloseButton />
    <DevTool control={control} /> {/* set up the dev tool */}
    <Modal.Content minWidth="500px">
      <Modal.Header>{"Add Space"}</Modal.Header>
      <Modal.Body>
        <ControlledForm
          control={control}
          formState={formState}
          Config={{
            space_name: {
              name: "Space Name",
              label: "Space Name",
              placeholder: "E.g. Patio",
            }
          }}
        />
        <Button.Group space={2} paddingTop={4}>
          <Button w={"100px"} variant="ghost" colorScheme="tertiary" onPress={onCancel}>
            {"Cancel"}
          </Button>
          <Button w={"100px"} onPress={handleSubmit(onSubmit)}>
            {"Save"}
          </Button>
        </Button.Group>
      </Modal.Body>
    </Modal.Content>
  </Modal>
}

const TableModal = ({ tableChoosen, setTableChoosen }: { tableChoosen: Table, setTableChoosen: (table: Table) => void }) => {
  const router = useRouter()
  const {
    control,
    formState,
    clearErrors,
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      admin: "",
      numberGuests: ""
    },
  })

  const onSubmit = (data: any) => {
    // setTableChoosen(null)
    // await api.post("/spaces", data)
    console.log(data)

    router.push(businessRoute.add_to_order("123"))
    // make a call to the backend to create this TAB with this table ID
  }

  const onCancel = () => {
    setTableChoosen(null)
    reset()
    clearErrors()
  }

  const renderContent = () => {
    switch (tableChoosen?.status) {
      case "OCCUPIED":
        return <>
          <Text>{"tableChoosen.ocuppant.name"}</Text>
          <Text>{"tableChoosen.ocuppant.phone"}</Text>
        </>
      case "RESERVED":
        return <>
          <Text>{"tableChoosen.reservation.name"}</Text>
          <Text>{"tableChoosen.reservation.phone"}</Text>
          <Text>{format(new Date(), "PPpp")}</Text>
        </>
      case "AVAILABLE":
      default:
        return <ControlledForm
          control={control}
          formState={formState}
          Config={SideBySideTabConfig}
        />
    }
  }


  return <Modal isOpen={!!tableChoosen} onClose={onCancel}>
    <DevTool control={control} /> {/* set up the dev tool */}
    <Modal.CloseButton />
    <Modal.Content minWidth="500px">
      <Modal.Header borderColor={"white"}>
        {"Table " + tableChoosen?._id}
        <Badge mt={2} width={'20'} colorScheme={badgeScheme(tableChoosen?.status)}>
          {tableChoosen?.status?.toUpperCase() ?? "AVAILABLE"}</Badge>
      </Modal.Header>
      <Modal.Body>
        {renderContent()}
        <Modal.Footer borderColor={"white"}>
          <Button.Group>
            <Button w={"100px"} variant="outline" colorScheme="tertiary" onPress={onCancel}>
              {"Cancel"}
            </Button>
            <Button w={"100px"} onPress={handleSubmit(onSubmit)}>
              {"Open tab"}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Body>
    </Modal.Content>
  </Modal >
}
const TabConfig = {
  numberGuests: {
    name: "numberGuests",
    label: "Num Guests",
    placeholder: "Select number of guests",
  },
  admin: {
    name: "admin",
    label: "Admin",
    placeholder: "Select an admin user",
  },
}

const { numberGuests, admin } = TabConfig

const SideBySideTabConfig = {
  info: [{ numberGuests }, { admin }]
}

const AddTableModal = ({ isModalOpen, setIsModalOpen, postNewTable }) => {
  const onSubmit = async () => {
    setIsModalOpen(false)
    await postNewTable()
  }

  const onCancel = () => {
    setIsModalOpen(false)
  }

  return <Modal isOpen={isModalOpen} onClose={onCancel}>
    <Modal.CloseButton />
    <Modal.Content minWidth="500px">
      <Modal.Header>{"Add Space"}</Modal.Header>
      <Modal.Body>
        <Text>Would you like to add a new table?</Text>
      </Modal.Body>
      <Modal.Footer>
        <Button.Group space={2} paddingTop={4}>
          <Button w={"100px"} variant="ghost" colorScheme="tertiary" onPress={onCancel}>
            {"Cancel"}
          </Button>
          <Button w={"100px"} onPress={onSubmit}>
            {"Yes"}
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
}
