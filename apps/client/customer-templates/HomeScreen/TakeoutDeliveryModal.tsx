import React, { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading } from 'native-base'
import { useForm } from 'react-hook-form'
import { ControlledForm, SideBySideInputConfig } from '../../components/ControlledForm'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { GetTabRequestsDocument, TakeoutDelivery, useCreateNewTakeoutOrDeliveryMutation } from '../../gen/generated'
import { useRouter } from 'next/router'
import { DevTool } from '@hookform/devtools'
import { setClientCookies } from '../../cookies'
import { customerRoute } from 'fasto-route'
import { useTranslation } from 'next-i18next'
import { getCustomerName, getCustomerPhone, setCustomerName, setCustomerPhone } from '../../localStorage/customerStorage'
import { z } from 'zod'

export const joinTabSchema = z.object({
  name: z.string().min(3, { message: 'error.nameRequired' }),
  phoneNumber: z.string().min(6, { message: 'error.required' }),
  type: z.nativeEnum(TakeoutDelivery),
})
export type JoinTabForm = z.infer<typeof joinTabSchema>

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
  type: {
    name: "type",
    inputType: "Select",
    label: "Takeout or Delivery",
    placeholder: "Enter an option",
    isRequired: true,
    defaultValue: TakeoutDelivery.Takeout,
    array: [{
      _id: TakeoutDelivery.Delivery,
      name: TakeoutDelivery.Delivery,
    },
    {
      _id: TakeoutDelivery.Takeout,
      name: TakeoutDelivery.Takeout,
    }]
  }
}

type OpenTabModalProps = {
  isOpen: boolean;
  setModalVisibility: () => void;
}

export const TakeoutDeliveryModal = ({ isOpen, setModalVisibility }: OpenTabModalProps) => {
  const router = useRouter()
  const { businessId } = router.query
  const { t } = useTranslation("customerHome")

  const { control, formState, handleSubmit } = useForm({
    resolver: zodResolver(joinTabSchema),
    defaultValues: {
      name: getCustomerName() || "",
      phoneNumber: getCustomerPhone() || "",
      type: TakeoutDelivery.Takeout
    },
  })

  const [clientRequestTab, { loading }] = useCreateNewTakeoutOrDeliveryMutation({
    refetchQueries: [
      { query: GetTabRequestsDocument }],
    onCompleted: (data) => {
      console.log("Tab Request Completed")
      if (!data?.createNewTakeoutOrDelivery ||
        typeof businessId !== "string") {
        console.error("Tab Request Error")
        return
      }

      setClientCookies(businessId, data.createNewTakeoutOrDelivery)

      router.push({
        pathname: customerRoute['/customer/[businessId]/menu'],
        query: { businessId: businessId }
      })
    },
    onError: (err) => {
      console.log("Tab Request Error", err)
    }
  })

  const handleNewTakeoutOrDelivery = useCallback(async (data: JoinTabForm) => {
    const { name, phoneNumber, type } = data

    if (!businessId) return

    await clientRequestTab({
      variables: {
        input: {
          name,
          phoneNumber,
          business: businessId as string,
          type
        },
      },
    })

    setCustomerName(name)
    setCustomerPhone(phoneNumber)

    setModalVisibility()

  }, [businessId, clientRequestTab, setModalVisibility])

  return (
    <>
      {isOpen && <DevTool control={control} />}
      <CustomModal
        isOpen={isOpen}
        onClose={setModalVisibility}
        HeaderComponent={<Heading>{t("takeoutOrDelivery")}</Heading>}
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
              {t("continue")}
            </Button>
            <Button
              isLoading={loading}
              onPress={setModalVisibility}
              colorScheme={"muted"} flex={1}>
              {t("cancel")}
            </Button>
          </>
        }
      />
    </>
  )
}
