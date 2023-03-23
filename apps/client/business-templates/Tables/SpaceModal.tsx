import React, { useCallback } from "react"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal } from "native-base";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ControlledForm } from "../../components/ControlledForm/ControlledForm";
import { useSpacesMutationHook } from "../../graphQL/SpaceQL";

const spaceSchema = z.object({
  space_name: z.string().
    min(2, "Please, enter a Space Name. Min 2 chars").
    max(15, "15 characters max")
})

type spaceSchemaInput = z.infer<typeof spaceSchema>

type SpaceModalProps = {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

export const SpaceModal = ({ isModalOpen, setIsModalOpen }: SpaceModalProps) => {
  const {
    control,
    formState,
    clearErrors,
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      space_name: "",
    },
    resolver: zodResolver(spaceSchema)
  })

  const {
    createSpace,
  } = useSpacesMutationHook();

  const onSubmit = useCallback(
    async (data: spaceSchemaInput) => {
      setIsModalOpen(false)

      await createSpace({
        variables: {
          input: { name: data.space_name, }
        }
      })
      reset()
    },
    [createSpace, reset, setIsModalOpen],
  )


  const onCancel = useCallback(() => {
    setIsModalOpen(false)
    reset()
    clearErrors()
  }, [clearErrors, reset, setIsModalOpen])

  return <Modal isOpen={isModalOpen} onClose={onCancel}>
    <Modal.CloseButton />
    <DevTool control={control} /> {/* set up the dev tool */}
    <Modal.Content minWidth="500px">
      <Modal.Header>{"Add Space"}</Modal.Header>
      <Modal.Body>
        <ControlledForm
          control={control}
          formState={formState}
          Config={{
            space_name: {
              name: "space_name",
              label: "Space Name",
              placeholder: "E.g. Patio",
            }
          }}
        />
        <Button.Group space={2} paddingTop={4}>
          <Button w={"100px"} variant="ghost" colorScheme="tertiary" onPress={onCancel}>
            {"Cancel"}
          </Button>
          <Button w={"100px"} onPress={handleSubmit(onSubmit)}>
            {"Save"}
          </Button>
        </Button.Group>
      </Modal.Body>
    </Modal.Content>
  </Modal>
}
