import { customerRoute } from 'fasto-route'
import { Button, Center, HStack, Heading, Input, VStack } from 'native-base'
import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { useGetBusinessInformationQuery } from '../../gen/generated'
import { Pressable } from 'react-native'
import { useRouter } from 'next/router'
import { showToast } from '../../components/showToast'
import { useTranslation } from 'next-i18next'

export const QRcodeAndShare = () => {

  const { t } = useTranslation("businessSettings")

  const router = useRouter()
  const locale = router.locale

  const { data, loading, error } = useGetBusinessInformationQuery()
  const [openModal, setOpenModal] = useState(false)

  const customerPath = data?.getBusinessInformation._id ? `${process.env.FRONTEND_URL}/${locale ?? "en"}${customerRoute['/customer/[businessId]'].replace("[businessId]", data?.getBusinessInformation._id)}`
    : null

  if (!customerPath) return null

  const shareLink = async () => {
    try {
      await navigator.share({
        title: t('shareTitle'),
        text: t('shareText'),
        url: customerPath,
      });

    } catch (error) {

      console.log({ error })

      showToast({//@ts-ignore
        message: error.message as string,
        status: "error"
      })
    }
  }

  const onClipBoardWrite = () => {
    navigator.clipboard.writeText(customerPath)

    showToast({
      message: t("copied")
    })
  }

  const onPrint = () => {
    let tempTitle

    tempTitle = document.title
    document.title = `${data?.getBusinessInformation.name} QR Code`

    print()
    document.title = tempTitle
  }

  // todo: finish function
  const onQRCodeShare = async () => {
    try {
      const QRCODE = document.getElementById("section-to-print");
      // console.log("canvas", canvas)
      // const ctx = canvas.getContext("myCanvas");
      // const img = document.getElementById("section-to-print");
      // // ctx.drawImage(img, 10, 10);

      // const fullQuality = canvas?.toDataURL("image/webp", 1.0);
      // console.log(fullQuality);

      const { body } = document

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = canvas.height = 100

      const tempImg = document.createElement('img')
      tempImg.addEventListener('load', onTempImageLoad)
      tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${QRCODE?.innerHTML}</div></foreignObject></svg>`)
      console.log(tempImg.src)

      const targetImg = document.createElement('img')
      body.appendChild(targetImg)

      function onTempImageLoad(e: any) {
        ctx?.drawImage(e.target, 0, 0)
        targetImg.src = canvas.toDataURL()
      }
      // navigator.vibrate(400)
      // await navigator.share({
      //   title: "t('shareTitle')",
      //   text: "t('shareText')",
      //   url: customerPath,
      // });

    } catch (error) {

      console.log({ error })

      showToast({//@ts-ignore
        message: error.message as string,
        status: "error"
      })
    }
  }

  return (
    <HStack flex={1} h={"100%"} justifyContent={"space-around"} space={12}>
      <VStack space={12} justifyContent={"space-between"} alignItems={"center"} flex={1}>
        <Heading>
          {t("QRCode")}
        </Heading>
        <Center flex={1}>
          <VStack alignItems={"center"} space={8}>
            <QRCode
              value={customerPath}
              size={200}
            />
          </VStack>
        </Center>

        <Button.Group w={"100%"}>
          <Button flex={1} colorScheme={"tertiary"} onPress={onQRCodeShare}>
            {t("share")}
          </Button>
          <Button flex={1} onPress={onPrint}>
            {t("print")}
          </Button>
        </Button.Group>
      </VStack>

      <VStack space={12} justifyContent={"space-between"} alignItems={"center"} flex={1}>
        <Heading >
          {t('shareLink')}
        </Heading>
        <Pressable onPress={() => window.open(customerPath)} >
          <Input
            w={400}
            colorScheme={"blue"}
            color={"blue.500"}
            fontSize={"lg"}
            variant="filled"
            placeholder="Filled"
            value={customerPath}
          />
        </Pressable>
        <Button.Group w={"100%"}>
          <Button
            isDisabled={!navigator.share}
            flex={1} colorScheme={"tertiary"} onPress={shareLink}>
            {t("share")}
          </Button >
          <Button flex={1} onPress={onClipBoardWrite}>
            {t("copy")}
          </Button>
        </Button.Group>
      </VStack>
    </HStack>
  )
}
