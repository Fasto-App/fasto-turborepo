import { customerRoute } from 'fasto-route'
import { Button, Center, HStack, Heading, Input, VStack } from 'native-base'
import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { useGetBusinessInformationQuery, useShareQrCodeMutation } from '../../gen/generated'
import { Pressable } from 'react-native'
import { useRouter } from 'next/router'
import { showToast } from '../../components/showToast'
import { useTranslation } from 'next-i18next'
import html2canvas from "html2canvas"
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { ControlledForm } from '../../components/ControlledForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const shareQRCodeSchema = z.object({
  email: z.string().email(),
})

type ShareQRCode = z.infer<typeof shareQRCodeSchema>

const useShareQRCode = () => {
  return useForm<ShareQRCode>({
    resolver: zodResolver(shareQRCodeSchema),
    defaultValues: {
      email: "",
    },
  })
}

export const QRcodeAndShare = () => {
  const [sharingQRCode, setsharingQRCode] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [dataBlob, setDataBlob] = useState<Blob>()

  const { t } = useTranslation("businessSettings")

  const router = useRouter()
  const locale = router.locale

  const { data, loading, error } = useGetBusinessInformationQuery()
  const [shareQRCode, { loading: shareLoading }] = useShareQrCodeMutation({
    onCompleted: () => {
      showToast({ message: t("qrCodeSent") })
    },
    onError: () => {
      showToast({
        message: t("somethingWentWrongQRCode"),
        status: "error"
      })
    },
  })


  const { control, handleSubmit, formState } = useShareQRCode()

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
      // @ts-ignore
      if (error.name === "AbortError") return

      showToast({
        message: t("somethingWentWrongSharingLink"),
        status: "error"
      })
    }
  }

  const onClipBoardWrite = () => {
    navigator.clipboard.writeText(customerPath)

    showToast({ message: t("copied") })
  }

  const onPrint = () => {
    let tempTitle

    tempTitle = document.title
    document.title = `${data?.getBusinessInformation.name} QR Code`

    print()
    document.title = tempTitle
  }

  const onQRCodeShare = async () => {

    if (dataBlob) {
      setOpenModal(true)
      return
    }

    try {
      let screenShot: HTMLElement | null

      setsharingQRCode(true)

      screenShot = document.querySelector("#section-to-print")
      if (!screenShot) throw new Error("QR Code not Found")

      screenShot.style.visibility = "visible"

      html2canvas(screenShot).then(canvas => {
        canvas.toBlob((blob) => {
          if (!blob) throw new Error("Blob not found")

          setDataBlob(blob)
          setOpenModal(true)
        }, "image/jpeg")

        if (!screenShot) throw new Error("QR Code not Found")
        screenShot.style.visibility = "hidden"
      })

    } catch (error) {
      showToast({
        message: t("somethingWentWrongQRCode"),
        status: "error"
      })
    } finally {
      setsharingQRCode(false)
    }
  }

  const sendQRCode = (data: ShareQRCode) => {
    if (!dataBlob) throw new Error("dataBlob does not exist")

    shareQRCode({
      variables: {
        input: {
          email: data.email,
          file: dataBlob
        }
      }
    })
  }

  return (
    <HStack flex={1} h={"100%"} justifyContent={"space-around"} space={12}>
      <CustomModal
        isOpen={openModal}
        HeaderComponent={<Heading size={"md"}>{t("shareQRCodeByEmail")}</Heading>}
        ModalBody={
          <ControlledForm
            control={control}
            formState={formState}
            Config={{
              email: {
                name: "email",
                label: t("email"),
                placeholder: "email@email.com"
              }
            }}
          />
        }
        ModalFooter={
          <Button.Group w={"100%"}>
            <Button
              flex={1}
              disabled={!dataBlob || shareLoading}
              isLoading={shareLoading}
              onPress={handleSubmit(sendQRCode)}
            >
              {t("send")}
            </Button>
            <Button
              isLoading={shareLoading}
              flex={1} colorScheme={"tertiary"} onPress={() => setOpenModal(false)}>
              {t("cancel")}
            </Button>
          </Button.Group>
        }
      />
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
          <Button flex={1} colorScheme={"tertiary"} onPress={onQRCodeShare} isLoading={sharingQRCode}>
            {t("share")}
          </Button>
          <Button flex={1} onPress={onPrint} isLoading={sharingQRCode} >
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
