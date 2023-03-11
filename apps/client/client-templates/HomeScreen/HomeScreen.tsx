import { Image, Box, Button, Center, Heading, VStack } from 'native-base'
import React, { useState } from 'react'
import { NavigationButton } from '../../components/atoms/NavigationButton'
import { useRouter } from 'next/router'
import { texts } from './texts'
import { QRCodeReader } from './QRCodeReader'

export const HomeScreen = () => {

  const [isJoinTabModalOpen, setIsJoinTabModalOpen] = useState(false)
  const route = useRouter()

  const joinTab = () => {
    console.log("Pressed")
    setIsJoinTabModalOpen(true)
  }

  const onPress = () => {
    route.push('/client/123/menu')
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
      <QRCodeReader
        isOpen={isJoinTabModalOpen}
        setModalVisibility={setIsJoinTabModalOpen}
      />
    </Center>
  )
}
