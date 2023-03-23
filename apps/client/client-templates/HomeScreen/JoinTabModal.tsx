import { useRouter } from 'next/router'
import React from 'react'
import { Box, Button, Heading } from 'native-base'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { QRCodeReader } from './QRCodeReader'
import { texts } from './texts'
import { zodResolver } from '@hookform/resolvers/zod'
import { joinTabSchema } from 'app-helpers'
import { useForm } from 'react-hook-form'
import { ControlledForm, SideBySideInputConfig } from '../../components/ControlledForm'

type JoinTabModalProps = {
  isOpen: boolean
  setModalVisibility: (isOpen: boolean) => void
}

const Config: SideBySideInputConfig = {
  name: {
    name: "name",
    label: "Name",
    type: 'text',
    placeholder: "Enter name",
    isRequired: true,
    autoFocus: true,
  },
  phoneNumber: {
    label: "Phone Number",
    placeholder: "+55 555 555 5555",
    name: "phoneNumber",
    isRequired: true,
    autoFocus: true,
    autoComplete: "tel-country-code"
  }
}

export const JoinTabModal = ({ isOpen, setModalVisibility }: JoinTabModalProps) => {

  // we should have another form asking for the name and number of the guest
  // we can also ask if the person know the person who opened the tab
  const router = useRouter()
  const { tabId, name } = router.query

  const { control, formState, handleSubmit } = useForm({
    resolver: zodResolver(joinTabSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  })


  return (
    <CustomModal
      isOpen={isOpen}
      HeaderComponent={<Heading>{
        tabId && typeof name === "string" ? texts.yourAboutToJoin(name) : texts.scanTheCode
      }</Heading>}
      ModalBody={!tabId ? <QRCodeReader /> : (
        <ControlledForm
          Config={Config}
          control={control}
          formState={formState}
        />
      )
      }
      ModalFooter={
        <Button.Group flex={1}>
          <Box flex={1}>
            {tabId && typeof name === "string" ?
              <Button
                onPress={() => setModalVisibility(false)}
                _text={{ bold: true }}
                w={"100%"}
              >
                {texts.joinTabName(name)}
              </Button> : null}
          </Box>
          <Box flex={1}>
            <Button
              onPress={() => setModalVisibility(false)}
              _text={{ bold: true }}
              colorScheme={"trueGray"}
              w={"100%"}
            >
              {texts.cancel}
            </Button>
          </Box>
        </Button.Group>
      }
    />
  )
}
