import React from "react"
import { Button, Modal, Text } from "native-base"
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation(["common", "businessTables"])

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
      <Modal.Header>{t("businessTables:addTable")}</Modal.Header>
      <Modal.Body>
        <Text>{t("businessTables:addNewTable")}</Text>
      </Modal.Body>
      <Modal.Footer>
        <Button.Group space={2} flex={1}>
          <Button w={"100px"} variant="outline" colorScheme="tertiary" onPress={onCancel} flex={1}>
            {t("common:cancel")}
          </Button>
          <Button w={"100px"} onPress={onSubmit} flex={1}>
            {t("common:yes")}
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
}
