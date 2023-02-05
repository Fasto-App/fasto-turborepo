import React from "react"
import { Button, Modal, Text } from "native-base"

type AddTableModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  postNewTable: () => Promise<void>;
}

export const AddTableModal = ({
  isModalOpen,
  setIsModalOpen,
  postNewTable
}: AddTableModalProps) => {
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
