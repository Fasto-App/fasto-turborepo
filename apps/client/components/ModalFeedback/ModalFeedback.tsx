import React from "react";
import { AlertDialog, Button, Center, CheckCircleIcon, DeleteIcon, WarningIcon } from "native-base";

const texts = {
  changesSaved: "Changes Saved!",
  somethingWentWrong: "Something went wrong.",
}

interface ModalFeedbackProps {
  isWarning?: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

export const ModalFeedback = ({ isOpen, onClose, isWarning }: ModalFeedbackProps) => {
  const cancelRef = React.useRef(null);

  const successIcon = isWarning ? `` : `🎉`
  const alertBody = isWarning ? texts.somethingWentWrong : texts.changesSaved;


  return <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={() => console.log(false)}>
    <AlertDialog.Content>
      <Center m={3}>
        {
          isWarning ? <WarningIcon size="5" color="warning.500" /> :
            <CheckCircleIcon size="5" color="success.500" />
        }
        <AlertDialog.Body textAlign={"center"}>
          {`${alertBody} ${successIcon}`}
        </AlertDialog.Body>
        <Button w={"100%"} colorScheme={isWarning ? "warning" : "success"} onPress={onClose}>
          Close
        </Button>
      </Center>
    </AlertDialog.Content>
  </AlertDialog >

}