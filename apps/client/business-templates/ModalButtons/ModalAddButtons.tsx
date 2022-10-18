import { Button } from 'native-base'
import React from 'react'

const texts = {
  add: "Add",
  delete: "Delete Category",
  cancel: "Cancel",
  save: "Save",

}

const ModalAddButtons = ({
  cancelAction,
  saveAction,
  isEditing,
}) => {
  return (
    <Button.Group space={2}>
      <Button w={"100px"}
        variant="ghost"
        colorScheme="tertiary"
        onPress={cancelAction}>
        {texts.cancel}
      </Button>
      <Button w={"100px"} onPress={saveAction}>
        {isEditing ? texts.save : texts.add}
      </Button>
    </Button.Group >
  )
}

export { ModalAddButtons }
