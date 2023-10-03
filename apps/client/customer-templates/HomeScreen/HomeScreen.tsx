import { Image, Box, Button, Center, Heading, VStack, Text, HStack, Skeleton } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { JoinTabModal } from './JoinTabModal'
import { OpenTabModal } from './OpenTabModal'
import { useGetBusinessInformation, useGetClientSession } from '../../hooks'
import { customerRoute } from 'fasto-route'
import { TakeoutDeliveryModal } from './TakeoutDeliveryModal'
import { getClientCookies } from '../../cookies'
import { useTranslation } from "next-i18next"
import { FDSSelect } from '../../components/FDSSelect'
import { Locale, localeObj } from 'app-helpers'
import NextImage from 'next/image'
import { Pressable } from 'react-native'


export const HomeScreen = () => {
  const [isJoinTabModalOpen, setIsJoinTabModalOpen] = useState(false)
  const [isOpenTabModalOpen, setIsOpenTabModalOpen] = useState(false)
  const [isTakeoutDeliveryModalOpen, setIsTakeoutDeliveryModalOpen] = useState(false)

  const { t } = useTranslation("customerHome")
  const route = useRouter()
  const { businessId, tabId, adminId, name } = route.query

  const onViewMenu = useCallback(() => {
    console.log("navigate")
    route.push({
      pathname: customerRoute["/customer/[businessId]/menu"],
      query: {
        businessId: businessId as string,
      }
    })
  }, [businessId, route])

  const onLogoPress = useCallback(() => {
    route.push({
      pathname: "/",
    })
  }, [route])

  const { data: tabData, loading, error } = useGetClientSession()
  const { data: businessInfo, loading: businessInfoLoading } = useGetBusinessInformation()

  const image = businessInfo?.getBusinessById?.picture
  const businessName = businessInfo?.getBusinessById?.name

  useEffect(() => {
    if (tabId &&
      name &&
      adminId) {
      setIsJoinTabModalOpen(true)
    }
  }, [adminId, name, tabId])

  useEffect(() => {
    const token = getClientCookies(businessId as string)
    if (token) {
      route.push({
        pathname: customerRoute["/customer/[businessId]/menu"],
        query: {
          businessId: businessId as string,
        }
      })
    }
  }, [businessId, route])


  return (
    <Center h={"100%"} backgroundColor={"white"}>
      <HStack
        position={"absolute"}
        top={0}
        w={"100%"}
        px={6}
        pt={4}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
      >
        <Pressable onPress={onLogoPress}>
          <Image src="/images/fasto-logo.svg"
            alt="Fasto Logo"
            height={36} width={180} />
        </Pressable>
        <FDSSelect
          w="70"
          h="8"
          array={localeObj}
          selectedValue={route.locale as Locale}
          setSelectedValue={(value) => {
            const path = route.asPath;
            return route.push(path, path, { locale: value });
          }} />
      </HStack>
      {businessInfoLoading ? <LoadingBusinessInfo /> :
        <>
          <Heading size={"2xl"}>{businessName}</Heading>
          <NextImage
            src={image ?? "/html/images/webclip.png"}
            alt={businessName}
            width={"150"}
            height={"150"}
            objectFit='cover'
            style={{ borderRadius: 5 }}
            priority
            blurDataURL='/html/images/webclip.png'
            placeholder='blur'
          />
        </>
      }
      <VStack space={6} mt={"10"} w={"80%"}>
        <Button
          isDisabled={loading || tabData?.getClientSession.request?.status === "Pending"}
          onPress={() => setIsOpenTabModalOpen(true)}
          _text={{ bold: true }}>{t("openNewTab")}</Button>
        <Button onPress={() => setIsTakeoutDeliveryModalOpen(true)}
          _text={{ bold: true }}
          colorScheme={"secondary"}>{t("takeoutOrDelivery")}</Button>
        {/* <Button onPress={onViewMenu}
          _text={{ bold: true }}
          colorScheme={"blueGray"}>{t("viewMenu")}</Button> */}
      </VStack>
      <JoinTabModal
        isOpen={isJoinTabModalOpen}
        setModalVisibility={setIsJoinTabModalOpen}
      />
      <OpenTabModal
        isOpen={isOpenTabModalOpen}
        setModalVisibility={() => setIsOpenTabModalOpen(false)}
      />
      <TakeoutDeliveryModal
        isOpen={isTakeoutDeliveryModalOpen}
        setModalVisibility={() => setIsTakeoutDeliveryModalOpen(false)}
      />
    </Center>
  )
}

const LoadingBusinessInfo = () => (
  <VStack>
    <Skeleton my="4" rounded="lg" />
    <Skeleton width={"150"} height={"150"} rounded="lg" />
  </VStack>
)
