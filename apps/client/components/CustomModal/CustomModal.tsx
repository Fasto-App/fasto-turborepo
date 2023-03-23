import React from "react"
import { Button, IModalProps, Modal } from "native-base"

type CustomModalProps = Pick<IModalProps, "size" | "isOpen" | "onClose"> & {
  HeaderComponent?: React.ReactNode;
  ModalBody: React.ReactNode;
  ModalFooter?: JSX.Element | JSX.Element[];
}

export const CustomModal = ({
  isOpen,
  onClose,
  size = "lg",
  HeaderComponent,
  ModalBody,
  ModalFooter
}: CustomModalProps) => {


  return <Modal
    size={size}
    isOpen={isOpen}
    onClose={onClose}
  >
    <Modal.CloseButton />
    <Modal.Content >

      <Modal.Header borderColor={"gray.50"}>
        {HeaderComponent}
      </Modal.Header>
      <Modal.Body>
        {ModalBody}
      </Modal.Body>
      {ModalFooter ? <Modal.Footer borderColor={"gray.50"}>
        <Button.Group flex={1} justifyContent={"center"} space={4}>
          {ModalFooter}
        </Button.Group>
      </Modal.Footer> : null}
    </Modal.Content>
  </Modal>

}