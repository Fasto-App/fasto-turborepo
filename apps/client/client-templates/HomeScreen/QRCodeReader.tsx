import { Box, Button, Text } from 'native-base';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react'
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

export const QRCodeReader = () => {
  const [qrCode, setQrCode] = React.useState<string | null>(null)
  const [qrCodeError, setQrCodeError] = React.useState<boolean>(false)
  const router = useRouter()

  const onResult = useCallback((result: any, error: any) => {

    if (!!result) {
      setQrCodeError(false)
      setQrCode(result.getText());

      try {
        const url = new URL(result.getText());
        const searchParams = new URLSearchParams(url.search);

        const tabId = searchParams.get("tabId");
        const name = searchParams.get("name");

        if (!tabId || !name) {
          setQrCodeError(true)
          return
        };

        router.push(`/?tabId=${tabId}&name=${name}`, undefined, { shallow: true })

      } catch (err) {
        console.log("Error parsing url", err)
        setQrCodeError(true)
      }
    }
  }, [router])

  return (
    <>
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={onResult}
      />
      <Text>
        {qrCode}
      </Text>
      {qrCodeError ? <Text color={"error.500"}>
        {texts.pleaseScanAValidCode}
      </Text> : null}
    </>
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
