import React, { useCallback, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { typedValues } from 'app-helpers'
import { Button, Heading } from 'native-base'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ControlledForm, RegularInputConfig, SideBySideInputConfig } from '../../components/ControlledForm'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { useOpenTabRequestMutation } from '../../gen/generated'

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

export const newTabSchema = z.object({
  guest1: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  phoneNumber: z.string().min(6, { message: 'Required' }),
  totalGuests: z.string().min(1, { message: 'Required' }),
}).passthrough();

type NewTabForm = z.infer<typeof newTabSchema>

const Config: SideBySideInputConfig = {
  guest1: {
    name: "guest1",
    label: "Guest 1 Name",
    placeholder: "Enter your name",
    isRequired: true,
  },
  phoneNumber: {
    label: "Phone Number",
    placeholder: "Enter your phone number",
    name: "phoneNumber",
    isRequired: true,
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
  const { control, formState, watch, handleSubmit } = useForm({
    mode: "onBlur",
    resolver: zodResolver(newTabSchema),
    defaultValues: {
      guest1: "",
      phoneNumber: "",
      totalGuests: "1",
    },
  })

  const { totalGuests } = watch() || {}

  const newConfig = useMemo(() => {
    const guestConfig = guestConfigObject(totalGuests)

    return guestConfig.reduce((acc, curr) => {
      return { ...acc, ...curr }
    }, Config)

  }, [totalGuests])

  const [clientRequestTab, { loading }] = useOpenTabRequestMutation({
    onCompleted: (data) => {
      console.log("Tab Request Completed")
      console.log(data)
    },
    onError: (err) => {
      console.log("Tab Request Error")
    }
  })

  const handleOpenTab = useCallback(async (data: NewTabForm) => {
    const { guest1, phoneNumber, totalGuests, ...rest } = data
    const array = typedValues(rest).filter((i: string) => i.trim() !== "")

    console.log("Sending information to create a Tab Request")
    console.log({
      input: {
        name: guest1,
        phoneNumber,
        totalGuests: parseInt(totalGuests),
        names: array.length > 0 ? array : undefined,
        business: "5f9f1b0b0f1c1c0017e1b1e1",
      },
    })

    await clientRequestTab({
      variables: {
        input: {
          name: guest1,
          phoneNumber,
          totalGuests: parseInt(totalGuests),
          names: array.length > 0 ? array : undefined,
        },
      },
    })

    setModalVisibility()

  }, [clientRequestTab, setModalVisibility])

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={setModalVisibility}
      HeaderComponent={<Heading>Request Tab</Heading>}
      ModalFooter={
        <>
          <Button
            isLoading={loading}
            onPress={handleSubmit(handleOpenTab)}
            flex={1}>
            Open New Tab
          </Button>
          <Button
            isLoading={loading}
            onPress={setModalVisibility}
            colorScheme={"muted"} flex={1}>
            Cancel
          </Button>
        </>
      }
      ModalBody={< ControlledForm
        Config={newConfig}
        control={control}
        formState={formState}
      />}
    />
  )
}
