import { Image, Box, Button, Center, Heading, VStack, Text } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { texts } from './texts'
import { JoinTabModal } from './JoinTabModal'
import { OpenTabModal } from './OpenTabModal'
import { useGetBusinessInformation, useGetClientSession } from '../../hooks'
import { clientRoute } from '../../routes'
import { Link } from '../../components/atoms/Link'
import { TakeoutDeliveryModal } from './TakeoutDeliveryModal'
import { getClientCookies } from '../../cookies'

export const HomeScreen = () => {
  const [isJoinTabModalOpen, setIsJoinTabModalOpen] = useState(false)
  const [isOpenTabModalOpen, setIsOpenTabModalOpen] = useState(false)
  const [isTakeoutDeliveryModalOpen, setIsTakeoutDeliveryModalOpen] = useState(false)

  const route = useRouter()
  const { businessId, tabId, adminId, name } = route.query

  const joinTab = useCallback(() => {
    console.log("Pressed")
    setIsJoinTabModalOpen(true)
  }, [])

  const onPress = useCallback(() => {
    route.push(clientRoute.menu(businessId as string))
  }, [businessId, route])

  const { data: tabData, loading, error } = useGetClientSession()
  const { data: businessInfo } = useGetBusinessInformation()

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
      route.push(clientRoute.menu(businessId as string))
    }
  }, [businessId, route])


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
      <Heading size={"2xl"}>{businessName}</Heading>
      <Image
        my={2}
        size="xl"
        source={{ uri: image ?? "https://via.placeholder.com/150" }}
        alt="Business Name"
      />
      <VStack space={6} mt={"10"} w={"80%"}>
        <Button
          isDisabled={loading || tabData?.getClientSession.request?.status === "Pending"}
          onPress={() => setIsOpenTabModalOpen(true)}
          _text={{ bold: true }}>{texts.openNewTab}</Button>
        <Button onPress={() => setIsTakeoutDeliveryModalOpen(true)}
          _text={{ bold: true }}
          colorScheme={"secondary"}>{texts.takeoutOrDelivery}</Button>
        <Button
          isDisabled={loading || tabData?.getClientSession.request?.status === "Pending"}
          onPress={joinTab}
          _text={{ bold: true }}
          colorScheme={"tertiary"}>{texts.joinTab}</Button>
        <Button onPress={onPress}
          _text={{ bold: true }}
          colorScheme={"blueGray"}>{texts.viewMenu}</Button>

        {/* <Link href='client/login'>
          Re-enter existing tab
        </Link> */}
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
