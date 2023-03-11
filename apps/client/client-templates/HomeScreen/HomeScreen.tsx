import { Image, Box, Button, Center, Heading, VStack, Text } from 'native-base'
import NextImage from 'next/image'
import React from 'react'
import { NavigationButton } from '../../components/atoms/NavigationButton'
import { CustomModal } from '../../components/CustomModal/CustomModal'

const texts = {
  openNewTab: 'Open a New Tab',
  joinTab: 'Join a Tab',
  viewMenu: 'View Menu',
  cancel: 'Cancel',
}

const handleOpenCamera = () => {
  console.log("handle open camera");
  if (
    "mediaDevices" in navigator &&
    "getUserMedia" in navigator.mediaDevices
  ) {
    const video = document.createElement("video");
    const canvas = document.getElementById("camera");

    // if canvas already have children, return
    if (canvas?.children.length) return;

    console.log({ canvas, video });
    canvas?.appendChild(video);
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.borderRadius = "5px";
    video.style.top = "0";
    video.style.zIndex = "99999999999999";

    console.log("Let's get this party started");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(function success(stream) {
        console.log({ stream });
        video.srcObject = stream;
      });
  }
};

export const HomeScreen = () => {
  const [isJoinTabModalOpen, setIsJoinTabModalOpen] = React.useState(false)

  // join a tab will open the camera and scan the QR code
  const joinTab = () => {
    console.log("Pressed")
    setIsJoinTabModalOpen(true)
    handleOpenCamera()
  }

  const onPress = () => {
    console.log("Pressed")
  }

  return (
    <Center h={"100%"} backgroundColor={"white"}>
      <Box
        position={"absolute"}
        top={0}
        w={"100%"}
        pl={6}
        pt={4}
        alignItems={"flex-start"}
      >
        <Image src="/images/Asset.svg" alt="me" width={"100"} height={"31"} />
      </Box>
      <Heading size={"2xl"}>Restaurant Name</Heading>
      <Image
        my={2}
        size="xl"
        source={{ uri: "https://cdn.logo.com/hotlink-ok/logo-social.png" }}
        alt="Business Name"
      />
      <VStack space={6} mt={"10"} w={"80%"}>
        <Button onPress={onPress} _text={{ bold: true }}>{texts.openNewTab}</Button>
        <Button onPress={joinTab} _text={{ bold: true }} colorScheme={"secondary"}>{texts.joinTab}</Button>
        <Button onPress={onPress} _text={{ bold: true }} colorScheme={"tertiary"}>{texts.viewMenu}</Button>
      </VStack>

      <Box
        position={"absolute"}
        bottom={0}
        w={"100%"}
        pr={6}
        pb={4}
        alignItems={"flex-end"}
      >
        <NavigationButton
          text={"Help"}
          type={"RaisedHand"}
          onPress={() => console.log("Home")}
        />
      </Box>
      {/* Add modal here */}
      <CustomModal
        isOpen={isJoinTabModalOpen}
        HeaderComponent={"Scan the QR code to join a tab"}
        ModalBody={
          <Box width={"100%"}>
            <div id={"camera"}>

            </div>
          </Box>
        }
        ModalFooter={
          <Button
            onPress={() => setIsJoinTabModalOpen(false)}
            _text={{ bold: true }}
            colorScheme={"trueGray"}
          >
            {texts.cancel}
          </Button>
        }
      />
    </Center>
  )
}
