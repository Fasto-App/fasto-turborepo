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
import { clientRoute } from '../../routes'
import { useTranslation } from 'next-i18next'

const array1to5 = Array.from({ length: 5 }, (_, i) => i + 1).map(
  (i) => ({ name: i.toString(), _id: i.toString() })
)

function guestConfigObject(number: string): RegularInputConfig[] {
  const num = parseInt(number)
  if (num === 1) return []

  return Array.from({ length: num - 1 }, (_, i) => i + 1).map(
    (i) => ({
      [`guest${i + 1}`]: {
        name: `guest${i + 1}`,
        label: `Guest ${i + 1} Name`,
        placeholder: `Optional`,
      },
    })
  )
}

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
  const { t } = useTranslation("clientHome")

  const { control, formState, watch, handleSubmit } = useForm({
    resolver: zodResolver(newTabSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      totalGuests: "1",
    },
  })

  const totalGuests = watch("totalGuests")

  const newConfig = useMemo(() => {
    const guestConfig = guestConfigObject(totalGuests)

    return guestConfig.reduce((acc, curr) => {
      return { ...acc, ...curr }
    }, Config)

  }, [totalGuests])

  const [clientRequestTab, { loading }] = useOpenTabRequestMutation({
    refetchQueries: [
      { query: GetTabRequestsDocument }],
    onCompleted: (data) => {
      console.log("Tab Request Completed")
      if (!data?.openTabRequest || typeof businessId !== "string") return

      setClientCookies(businessId, data.openTabRequest)
      router.push(clientRoute.menu(businessId as string))
    },
    onError: (err) => {
      console.log("Tab Request Error")
    }
  })

  const handleOpenTab = useCallback(async (data: NewTabForm) => {
    const { name, phoneNumber, totalGuests, ...rest } = data
    const array = typedValues(rest).filter((i) => (i as string).trim() !== "") as string[]

    await clientRequestTab({
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

    setModalVisibility()

  }, [clientRequestTab, setModalVisibility, businessId])

  return (
    <>
      <DevTool control={control} />
      <CustomModal
        isOpen={isOpen}
        onClose={setModalVisibility}
        HeaderComponent={<Heading>{t("requestTab")}</Heading>}
        ModalBody={
          <ControlledForm
            Config={newConfig}
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
