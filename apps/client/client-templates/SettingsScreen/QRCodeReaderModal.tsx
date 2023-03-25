import { Heading, Center, Button } from 'native-base'
import React from 'react'
import QRCode from 'react-qr-code'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { texts } from './texts'

type QRCodeReaderModalProps = {
  isModalOpen: boolean,
  setIsModalOpen: (value: boolean) => void,
  QR_CODE: string,
}

export const QRCodeReaderModal = ({
  isModalOpen,
  setIsModalOpen,
  QR_CODE,
}: QRCodeReaderModalProps) => {
  return (
    <CustomModal
      size={"xl"}
      onClose={() => setIsModalOpen(false)}
      isOpen={isModalOpen}
      HeaderComponent={<Heading textAlign={"center"} fontSize={"2xl"}>
        {texts.inviteGuestsWithQRCode}
      </Heading>}
      ModalBody={
        <Center flex={1}>
          <QRCode
            value={QR_CODE}
            size={300}
            level={"L"}
          />
        </Center>
      }
      ModalFooter={<Button
        colorScheme={"tertiary"}
        w={"100%"}
        onPress={() => setIsModalOpen(false)}>
        {texts.close}
      </Button>}
    />
  )
}
