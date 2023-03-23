import { Box, Button, Text } from 'native-base';
import { useRouter } from 'next/router';
import React from 'react'
import { QrReader } from 'react-qr-reader';
import { CustomModal } from '../../components/CustomModal/CustomModal';
import { texts } from './texts';

// todo - do some exploration  on using html5 code reader
// import { useHtml5QrCodeScanner } from 'react-html5-qrcode-reader';
// or use browser native code reader and God

type QRCodeReaderProps = {
  isOpen: boolean
  setModalVisibility: (isOpen: boolean) => void
}

export const QRCodeReader = ({ isOpen, setModalVisibility }: QRCodeReaderProps) => {
  const route = useRouter()
  const [qrCode, setQrCode] = React.useState<string | null>(null)
  return (
    <CustomModal
      isOpen={isOpen}
      HeaderComponent={"Scan the QR code to join a tab"}
      ModalBody={
        <Box width={"100%"} >
          <QrReader
            videoContainerStyle={{ borderRadius: 10, borderWidth: 1, borderColor: "black" }}
            videoStyle={{ borderRadius: 10, borderWidth: 1, borderColor: "black" }}
            containerStyle={{ borderRadius: 10, borderWidth: 1, borderColor: "black" }}
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) {
                setQrCode(result.getText());
                console.info(result)
                //todo: if the QR code is valid, navigate to the tab
                console.log("Navigating to tab")
              }
            }}
          />
          <Text>
            {qrCode}
          </Text>
        </Box>
      }
      ModalFooter={
        <Button
          onPress={() => setModalVisibility(false)}
          _text={{ bold: true }}
          colorScheme={"trueGray"}
        >
          {texts.cancel}
        </Button>
      }
    />
  )
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
        video: {
          facingMode: "environment",
        },
      })
      .then(function success(stream) {
        console.log({ stream });
        video.srcObject = stream;
      });
  }
};
