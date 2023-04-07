import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { Box, Button, Heading } from 'native-base'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { QRCodeReader } from './QRCodeReader'
import { texts } from './texts'
import { zodResolver } from '@hookform/resolvers/zod'
import { JoinTabForm, joinTabSchema } from 'app-helpers'
import { useForm } from 'react-hook-form'
import { ControlledForm, SideBySideInputConfig } from '../../components/ControlledForm'
import { useRequestJoinTabMutation } from '../../gen/generated'
import { setClientCookies } from '../../cookies'
import { clientRoute } from '../../routes'

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
  const router = useRouter()
  const { tabId, name, adminId, businessId } = router.query

  const { control, formState, handleSubmit } = useForm({
    resolver: zodResolver(joinTabSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  })

  const [requestJoinTab, { loading }] = useRequestJoinTabMutation({
    onError: (error) => {
      console.log(error)
    },
    onCompleted: (data) => {
      // get the token back and store in the cookies
      console.log("Tab Request Completed")
      if (!data?.requestJoinTab || typeof businessId !== "string") return

      setClientCookies(businessId, data?.requestJoinTab)
      router.push(clientRoute.menu(businessId))
    }
  })

  const handleJoinTab = useCallback(async (data: JoinTabForm) => {
    console.log("clicked")
    console.log(data)

    if (!tabId || !adminId) {
      alert("Error: COuld not read QR Code properly")
      return
    }

    await requestJoinTab({
      variables: {
        input: {
          tab: typeof tabId === "string" ? tabId : tabId[0],
          admin: typeof adminId === "string" ? adminId : adminId[0],
          name: data.name,
          phoneNumber: data.phoneNumber,
          business: router.query.businessId as string,
        }
      }
    })

    setModalVisibility(false)

  }, [adminId, requestJoinTab, router.query.businessId, setModalVisibility, tabId])


  return (
    <CustomModal
      onClose={() => setModalVisibility(false)}
      isOpen={isOpen}
      HeaderComponent={<Heading>{
        tabId && name ? texts.yourAboutToJoin(
          typeof name === "string" ? name : name?.[0]
        ) : texts.scanTheCode
      }</Heading>}
      ModalBody={tabId && name ? (
        <ControlledForm
          Config={Config}
          control={control}
          formState={formState}
        />
      ) :
        <QRCodeReader />}
      ModalFooter={
        <Button.Group flex={1}>
          <Box flex={1}>
            {tabId && name ?
              <Button
                onPress={handleSubmit(handleJoinTab)}
                _text={{ bold: true }}
                w={"100%"}
              >
                {texts.join}
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
