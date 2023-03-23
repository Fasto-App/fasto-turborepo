import { Image, Box, Button, Center, Heading, VStack } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { texts } from './texts'
import { JoinTabModal } from './JoinTabModal'
import { OpenTabModal } from './OpenTabModal'
import { useGetBusinessInformation, useGetTabRequest } from '../../hooks'
import { clientRoute } from '../../routes'

export const HomeScreen = () => {
  const [isJoinTabModalOpen, setIsJoinTabModalOpen] = useState(false)
  const [isOpenTabModalOpen, setIsOpenTabModalOpen] = useState(false)
  const route = useRouter()
  const { businessId } = route.query

  const joinTab = useCallback(() => {
    console.log("Pressed")
    setIsJoinTabModalOpen(true)
  }, [])

  const onPress = useCallback(() => {
    route.push(clientRoute.menu(businessId as string))
  }, [businessId, route])

  const { data: tabData } = useGetTabRequest()
  const { data: businessInfo } = useGetBusinessInformation()

  const image = businessInfo?.getBusinessById?.picture
  const name = businessInfo?.getBusinessById?.name



  useEffect(() => {
    if (route.query.tabId) {
      setIsJoinTabModalOpen(true)
    }
  }, [route.query.tabId, tabData])


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
      <Heading size={"2xl"}>{name}</Heading>
      <Image
        my={2}
        size="xl"
        source={{ uri: image ?? "https://via.placeholder.com/150" }}
        alt="Business Name"
      />
      <VStack space={6} mt={"10"} w={"80%"}>
        <Button
          isDisabled={tabData?.getTabRequest?.status === "Pending"}
          onPress={() => setIsOpenTabModalOpen(true)}
          _text={{ bold: true }}>{texts.openNewTab}</Button>
        <Button
          isDisabled={tabData?.getTabRequest?.status === "Pending"}
          onPress={joinTab}
          _text={{ bold: true }}
          colorScheme={"secondary"}>{texts.joinTab}</Button>
        <Button onPress={onPress}
          _text={{ bold: true }}
          colorScheme={"tertiary"}>{texts.viewMenu}</Button>
      </VStack>
      <JoinTabModal
        isOpen={isJoinTabModalOpen}
        setModalVisibility={setIsJoinTabModalOpen}
      />
      <OpenTabModal
        isOpen={isOpenTabModalOpen}
        setModalVisibility={() => setIsOpenTabModalOpen(false)}
      />
    </Center>
  )
}
