import React from "react"
import * as z from "zod"
import { Box, Button, Divider, FlatList, Heading, HStack, Text, VStack, Modal, Center, Badge, Image, Input, CheckIcon, Select } from "native-base"
import { useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { typedKeys } from "../../authUtilities/utils"
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pressable } from "react-native"
import { add, format } from 'date-fns'
import { ModalFeedback } from "../../components/ModalFeedback/ModalFeedback"
import { useSpacesMutationHook } from "../../graphQL/SpaceQL"
import { AllAndEditButtons } from "../AllAndAddButons"
import { useTableMutationHook } from "../../graphQL/TableQL"
import { OrderStatus, Table, TableStatus } from "../../gen/generated"
import { DevTool } from "@hookform/devtools";
import { useTabMutationHook } from "../../graphQL/TabQL"
import { businessRoute } from "../../routes"
import { useRouter } from "next/router"
import { Tile } from "../../components/Tile"
import { parseToCurrency } from "../../utils"

const texts = {
  space: "Space"
}

type SelectedTable = Omit<Table, "__typename" | "space" | "tab">

const patrons = new Array(3).fill({
  id: 2,
  name: "Alexandre",
})

export const TablesScreen = () => {
  const {
    allSpaces,
  } = useSpacesMutationHook();

  const [selectedSpaceId, setSelectedSpace] = useState<string>(allSpaces?.[0]?._id);
  const [isSpaceModalOpen, setSpaceIsModalOpen] = useState(false)
  const [tableChoosen, setTableChoosen] = useState<SelectedTable>(null)
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
          _id: item._id,
          status: item.status,
          tableNumber: item.tableNumber,
        })
      }} />)
  }

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

    await createSpace({
      variables: {
        input: { name: data.space_name, }
      }
    })
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
              name: "space_name",
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

const tableSchema = z.object({
  admin: z.string().optional(),
  totalUsers: z.number({
    required_error: "Please, enter the number of guests",
  }),
})


const orders = new Array(3).fill({
  id: "1",
  name: "Pizza de Catupiry com Borda",
  mage: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F19%2F2022%2F05%2F09%2Fbacon-509429382.jpg&q=60",
  price: 1000,
  quantity: 2,
  status: "DELIVERED",
})

const TableModal = ({ tableChoosen, setTableChoosen }: { tableChoosen: SelectedTable, setTableChoosen: (table: Table) => void }) => {
  const router = useRouter()
  const { createTab } = useTabMutationHook();

  const {
    control,
    formState,
    clearErrors,
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      admin: "",
      totalUsers: ""
    },
    resolver: zodResolver(tableSchema)
  })

  const onSubmit = async (data: any) => {
    try {
      console.log({
        table: tableChoosen._id,
        admin: data.admin,
        totalUsers: data.totalUsers
      })
      const result = await createTab({
        variables: {
          input: {
            table: tableChoosen._id,
            admin: data.admin,
            totalUsers: data.totalUsers
          }
        }
      })

      router.push(businessRoute.add_to_order(result.data.createTab._id))
    } catch { }
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
          <Box>
            <HStack flex={1} justifyContent={"space-around"}>
              <Heading size={"md"}>{"By Patron"}</Heading>
              <Heading size={"md"}>{"By Table"}</Heading>
            </HStack>
            <Box p={8}>
              <HStack space={2} pb={10}>
                {patrons.map((patron) => (
                  <Tile children={patron.name} selected={false} onPress={undefined} />
                ))}
              </HStack>

              {<VStack space={6}>
                {orders.map((order) => {
                  return (
                    <HStack borderRadius={"md"} p={1} backgroundColor={"white"} flex={1} justifyContent={"space-between"}>
                      <HStack>
                        <Center>
                          <Image src={"https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F19%2F2022%2F05%2F09%2Fbacon-509429382.jpg&q=60"}
                            width={100} height={60}
                          />
                        </Center>
                        <VStack pl={2} pt={3}>
                          <Heading size={"sm"}>{`${order.name}`}</Heading>
                          <Text>{`${parseToCurrency(order.price)}`}</Text>
                        </VStack>
                      </HStack>

                      <Center>
                        <Select selectedValue={"DELIVERED"} minWidth="200" accessibilityLabel="Choose Service" placeholder="Order Status" mt={1} onValueChange={itemValue => console.log(itemValue)}>
                          {Object.keys(OrderStatus).map((status) => (
                            <Select.Item label={status} value={status.toUpperCase()} />)
                          )
                          }
                        </Select>
                      </Center>
                      <Center>
                        <Text>{`${parseToCurrency(order.price * order.quantity)}`}</Text>
                      </Center>
                      <Center>
                        <Text >{`${order.quantity}x`}</Text>
                      </Center>
                      <Center p={6}>
                        <CheckIcon />
                      </Center>
                    </HStack>)
                })}
              </VStack>}

            </Box>
          </Box>


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


  return <Modal size={"full"} isOpen={!!tableChoosen} onClose={onCancel}>
    <DevTool control={control} /> {/* set up the dev tool */}
    <Modal.CloseButton />
    <Modal.Content >
      <Modal.Header borderColor={"gray.50"}>
        {"Table " + tableChoosen?._id}
        <Badge mt={2} width={'20'} colorScheme={badgeScheme(tableChoosen?.status)}>
          {tableChoosen?.status?.toUpperCase() ?? "AVAILABLE"}</Badge>
      </Modal.Header>
      <Modal.Body>
        {renderContent()}
      </Modal.Body>
      <Modal.Footer borderColor={"gray.50"}>
        <Button.Group flex={1} justifyContent={"center"} space={4}>
          <Button w={"200px"} variant="outline" colorScheme="tertiary" onPress={onCancel}>
            {"Cancel"}
          </Button>
          <Button w={"200px"} onPress={handleSubmit(onSubmit)}>
            {"Open tab"}
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal >
}

const TabConfig: RegularInputConfig = {
  totalUsers: {
    name: "totalUsers",
    label: "Num Guests",
    placeholder: "Select number of guests",
    errorMessage: "Please, enter a number of guests",
    helperText: "Number of guests",
    formatOnChange: (value: string, fieldOnchange: (number) => void) => {
      if (Number.isInteger(Number(value))) {
        return fieldOnchange(Number(value))
      }
    }
  },
  admin: {
    name: "admin",
    label: "Admin",
    placeholder: "Select an admin user",
  },
}

const { totalUsers, admin } = TabConfig

const SideBySideTabConfig: SideBySideInputConfig = {
  info: [{ totalUsers }, { admin }]
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
