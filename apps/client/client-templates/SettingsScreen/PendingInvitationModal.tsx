import { Heading, HStack, Box, Button, Text, FlatList } from 'native-base'
import React from 'react'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { texts } from './texts'

type PendingInvitationModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

export const PendingInvitationModal = (props: PendingInvitationModalProps) => {
  const { isModalOpen, setIsModalOpen } = props
  return (
    <CustomModal
      size={"full"}
      onClose={() => setIsModalOpen(false)}
      isOpen={isModalOpen}
      HeaderComponent={<Heading textAlign={"center"} fontSize={"2xl"}>
        {texts.pendingInvitations}
      </Heading>}
      ModalBody={<FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderItem={({ index }) => <PendingInvitationTile index={index} />}
      />}
      ModalFooter={<Button
        colorScheme={"gray"}
        w={"100%"}
        onPress={() => setIsModalOpen(false)}>
        {texts.close}
      </Button>}
    />
  )
}

const PendingInvitationTile = ({ index }: { index: number }) => {
  return (
    <HStack
      space={4}
      p={2}
      backgroundColor={index % 2 === 0 ? "secondary.200" : "white"}
      borderRadius={"md"}
    >
      <Box>
        <Text fontSize={"lg"}>
          Ronaldo
        </Text>
        <Text fontSize={"md"}>
          +55 11 99999-9999
        </Text>
      </Box>
      <Button.Group h={"45"} flex={1} justifyContent={"space-between"} space={4}>
        <Button flex={1}>
          {texts.accept}
        </Button>
        <Button flex={1} colorScheme={"tertiary"}>
          {texts.decline}
        </Button>
      </Button.Group>
    </HStack>
  )
}
