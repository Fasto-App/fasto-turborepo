import { customerRoute } from 'fasto-route'
import { Button, Center, HStack, Heading, Input, VStack } from 'native-base'
import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { useGetBusinessInformationQuery } from '../../gen/generated'
import { Pressable } from 'react-native'
import { useRouter } from 'next/router'
import { showToast } from '../../components/showToast'
import { useTranslation } from 'next-i18next'
// import { useGetBusinessInformation } from '../../hooks'

export const QRcodeAndShare = () => {

  const { t } = useTranslation("common")
  // get the business is
  const router = useRouter()
  const locale = router.locale

  console.log("locale", locale)
  const { data, loading, error } = useGetBusinessInformationQuery()
  const [openModal, setOpenModal] = useState(false)

  const customerPath = data?.getBusinessInformation._id ? `${process.env.FRONTEND_URL}/${locale ?? "en"}${customerRoute['/customer/[businessId]'].replace("[businessId]", data?.getBusinessInformation._id)}`
    : null

  if (!customerPath) return null

  const shareLink = async () => {
    try {
      await navigator.share({
        title: "t('shareTitle')",
        text: "t('shareText')",
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
      message: "COPIED!"
    })
  }

  const onPrint = () => {
    let tempTitle

    tempTitle = document.title
    document.title = `${data?.getBusinessInformation.name} QR Code`

    print()
    document.title = tempTitle
  }

  const onQRCodeShare = async () => {
    try {
      navigator.vibrate(400)
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

    <>
      <HStack flex={1} h={"100%"} justifyContent={"space-around"} space={12}>
        <VStack space={12} justifyContent={"space-between"} alignItems={"center"} flex={1}>
          <Heading>
            QR Code
          </Heading>

          <div id="QR-CODE">
            <Center flex={1}>
              <VStack alignItems={"center"} space={8}>
                <QRCode
                  value={customerPath}
                  size={200}
                />
              </VStack>
            </Center>
          </div>

          <Button.Group w={"100%"}>
            <Button flex={1} colorScheme={"tertiary"} onPress={onQRCodeShare}>
              Share
            </Button>
            <Button flex={1} onPress={onPrint}>
              Print
            </Button>
          </Button.Group>
        </VStack>

        <VStack space={12} justifyContent={"space-between"} alignItems={"center"} flex={1}>
          <Heading >
            Share Link
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
            // style={{cursor: ""}}
            />
          </Pressable>
          <Button.Group w={"100%"}>
            <Button
              isDisabled={!navigator.share}
              flex={1} colorScheme={"tertiary"} onPress={shareLink}>
              Share
            </Button >
            <Button flex={1} onPress={onClipBoardWrite}>
              Copy
            </Button>
          </Button.Group>
        </VStack>
      </HStack>
    </>
  )
}
