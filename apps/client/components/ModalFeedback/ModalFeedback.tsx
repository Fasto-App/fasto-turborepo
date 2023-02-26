import React from "react";
import { AlertDialog, Button, Center, CheckCircleIcon, DeleteIcon, WarningIcon } from "native-base";
import { useAppStore } from "../../business-templates/UseAppStore";
import { shallow } from "zustand/shallow";

const texts = {
  changesSaved: "Changes Saved!",
  somethingWentWrong: "Something went wrong.",
  close: "Close",
}

export const ModalFeedback = () => {
  const cancelRef = React.useRef(null);
  const { networkState, setNetworkState } = useAppStore((state) => ({
    networkState: state.networkState,
    setNetworkState: state.setNetworkState
  }), shallow);

  const isSuccess = networkState === "success";
  const successIcon = isSuccess ? `🎉` : ``
  const alertBody = isSuccess ? texts.changesSaved : texts.somethingWentWrong;


  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={networkState !== "idle"}
      onClose={() => console.log("closing alert dialog")}
    >
      <AlertDialog.Content>
        <Center m={3}>
          {!isSuccess ? <WarningIcon size="5" color="warning.500" /> :
            <CheckCircleIcon size="5" color="success.500" />}
          <AlertDialog.Body textAlign={"center"}>
            {`${alertBody} ${successIcon}`}
          </AlertDialog.Body>
          <Button
            w={"100%"}
            colorScheme={!isSuccess ? "warning" : "success"}
            onPress={() => setNetworkState("idle")}
          >
            {texts.close}
          </Button>
        </Center>
      </AlertDialog.Content>
    </AlertDialog >
  )

}