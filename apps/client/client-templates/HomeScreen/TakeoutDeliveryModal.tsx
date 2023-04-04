import React, { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { JoinTabForm, joinTabSchema } from 'app-helpers'
import { Button, Heading } from 'native-base'
import { useForm } from 'react-hook-form'
import { ControlledForm, SideBySideInputConfig } from '../../components/ControlledForm'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { GetTabRequestsDocument, useCreateNewTakeoutOrDeliveryMutation } from '../../gen/generated'
import { useRouter } from 'next/router'
import { DevTool } from '@hookform/devtools'
import { setClientCookies } from '../../cookies/businessCookies'
import { clientRoute } from '../../routes'
import { texts } from './texts'

const Config: SideBySideInputConfig = {
  name: {
    name: "name",
    label: "Your Name",
    type: 'text',
    placeholder: "Enter your name",
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
  },
}

type OpenTabModalProps = {
  isOpen: boolean;
  setModalVisibility: () => void;
}

export const TakeoutDeliveryModal = ({ isOpen, setModalVisibility }: OpenTabModalProps) => {
  const router = useRouter()
  const { businessId } = router.query

  const { control, formState, handleSubmit } = useForm({
    resolver: zodResolver(joinTabSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  })

  const [clientRequestTab, { loading }] = useCreateNewTakeoutOrDeliveryMutation({
    refetchQueries: [
      { query: GetTabRequestsDocument }],
    onCompleted: (data) => {
      console.log("Tab Request Completed")
      if (!data?.createNewTakeoutOrDelivery) return

      setClientCookies("token", data.createNewTakeoutOrDelivery)
      setClientCookies("token", data.createNewTakeoutOrDelivery)
      router.push(clientRoute.menu(businessId as string))
    },
    onError: (err) => {
      console.log("Tab Request Error", err)
    }
  })

  const handleNewTakeoutOrDelivery = useCallback(async (data: JoinTabForm) => {
    const { name, phoneNumber } = data

    if (!businessId) return

    await clientRequestTab({
      variables: {
        input: {
          name,
          phoneNumber,
          business: businessId as string,
        },
      },
    })

    setModalVisibility()

  }, [businessId, clientRequestTab, setModalVisibility])

  return (
    <>
      <DevTool control={control} />
      <CustomModal
        isOpen={isOpen}
        onClose={setModalVisibility}
        HeaderComponent={<Heading>{texts.takeoutOrDelivery}</Heading>}
        ModalBody={
          <ControlledForm
            Config={Config}
            control={control}
            formState={formState}
          />
        }
        ModalFooter={
          <>
            <Button
              isLoading={loading}
              onPress={handleSubmit(handleNewTakeoutOrDelivery)}
              flex={1}>
              {texts.continue}
            </Button>
            <Button
              isLoading={loading}
              onPress={setModalVisibility}
              colorScheme={"muted"} flex={1}>
              {texts.cancel}
            </Button>
          </>
        }
      />
    </>
  )
}
