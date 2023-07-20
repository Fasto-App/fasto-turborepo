import React, { useCallback, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewTabForm, newTabSchema, typedValues } from 'app-helpers'
import { Box, Button, Heading, Input } from 'native-base'
import { useForm } from 'react-hook-form'
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from '../../components/ControlledForm'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { GetTabRequestDocument, GetTabRequestsDocument, useOpenTabRequestMutation } from '../../gen/generated'
import { useRouter } from 'next/router'
import { DevTool } from '@hookform/devtools'
import { setClientCookies } from '../../cookies'
import { customerRoute } from 'fasto-route'
import { useTranslation } from 'next-i18next'
import { getCustomerName, getCustomerPhone, setCustomerName, setCustomerPhone } from '../../localStorage/customerStorage'

const array1to5 = Array.from({ length: 5 }, (_, i) => i + 1).map(
  (i) => ({ name: i.toString(), _id: i.toString() })
)

const Config: SideBySideInputConfig = {
  name: {
    name: "name",
    label: "Guest 1 Name",
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
  totalGuests: {
    label: "Total Guests",
    placeholder: "Enter total guests",
    name: "totalGuests",
    inputType: "Select",
    array: array1to5,
    defaultValue: "1",
    isRequired: true,
  }
}

type OpenTabModalProps = {
  isOpen: boolean;
  setModalVisibility: () => void;
}

export const OpenTabModal = ({ isOpen, setModalVisibility }: OpenTabModalProps) => {
  const router = useRouter()
  const { businessId } = router.query
  const { t } = useTranslation("customerHome")

  const { control, formState, watch, handleSubmit } = useForm({
    resolver: zodResolver(newTabSchema),
    defaultValues: {
      name: getCustomerName() || "",
      phoneNumber: getCustomerPhone() || "",
      totalGuests: "1",
    },
  })

  const [openTabRequest, { loading }] = useOpenTabRequestMutation({
    refetchQueries: [
      { query: GetTabRequestsDocument }],
    onCompleted: (data) => {
      console.log("Tab Request Completed")
      if (!data?.openTabRequest || typeof businessId !== "string") throw new Error("Tab Request Error")

      setClientCookies(businessId, data.openTabRequest)

      router.push({
        pathname: customerRoute['/customer/[businessId]/menu'],
        query: {
          businessId
        }
      })
    },
    onError: (err) => {
      console.log("Tab Request Error")
    }
  })

  const handleOpenTab = useCallback(async (data: NewTabForm) => {
    const { name, phoneNumber, totalGuests, ...rest } = data
    const array = typedValues(rest).filter((i) => (i as string).trim() !== "") as string[]

    await openTabRequest({
      variables: {
        input: {
          name,
          phoneNumber,
          totalGuests: parseInt(totalGuests),
          names: array.length > 0 ? array : undefined,
          business: businessId as string,
        },
      },
    })

    setCustomerName(name)
    setCustomerPhone(phoneNumber)

    setModalVisibility()

  }, [openTabRequest, setModalVisibility, businessId])

  return (
    <>
      {isOpen && <DevTool control={control} />}
      <CustomModal
        isOpen={isOpen}
        onClose={setModalVisibility}
        HeaderComponent={<Heading>{t("requestTab")}</Heading>}
        ModalBody={
          <ControlledForm
            Config={{
              ...Config,
              name: {
                ...Config.name,
                label: t("guestName"),
              },
              phoneNumber: {
                ...Config.phoneNumber,
                label: t("phoneNumber"),
              },
              totalGuests: {
                ...Config.totalGuests,
                label: t("totalGuests"),
              },
            }}
            control={control}
            formState={formState}
          />
        }
        ModalFooter={
          <>
            <Button
              isLoading={loading}
              onPress={handleSubmit(handleOpenTab)}
              flex={1}>
              {t("openNewTab")}
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
