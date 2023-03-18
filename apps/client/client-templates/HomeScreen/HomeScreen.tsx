import { Image, Box, Button, Center, Heading, VStack } from 'native-base'
import React, { useState } from 'react'
import { NavigationButton } from '../../components/atoms/NavigationButton'
import { useRouter } from 'next/router'
import { texts } from './texts'
import { QRCodeReader } from './QRCodeReader'
import { OpenTabModal } from './OpenTabModal'
import { useGetBusinessByIdQuery } from '../../gen/generated'
import { useGetTabRequest } from '../../hooks'

export const HomeScreen = () => {

  const [isJoinTabModalOpen, setIsJoinTabModalOpen] = useState(false)
  const [isOpenTabModalOpen, setIsOpenTabModalOpen] = useState(false)
  const route = useRouter()
  const { businessId } = route.query

  const joinTab = () => {
    console.log("Pressed")
    setIsJoinTabModalOpen(true)
  }

  const onPress = () => {
    route.push('/client/123/menu')
  }

  const { data: tabData } = useGetTabRequest()

  const { data } = useGetBusinessByIdQuery({
    skip: !businessId,
    variables: {
      input: {
        _id: businessId as string
      }
    }
  })

  const image = data?.getBusinessById?.picture
  const name = data?.getBusinessById?.name

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
      <QRCodeReader
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
