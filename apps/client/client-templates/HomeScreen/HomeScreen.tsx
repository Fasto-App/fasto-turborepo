import { Image, Box, Button, Center, Heading, VStack } from 'native-base'
import React from 'react'
import { NavigationButton } from '../../components/atoms/NavigationButton'
import { NavigationButtonType } from '../../components/types'

const texts = {
  openNewTab: 'Open a New Tab',
  joinTab: 'Join a Tab',
  viewMenu: 'View Menu',
}

export const HomeScreen = () => {
  return (
    <Center h={"100%"}>
      <Heading size={"2xl"}>Restaurant Name</Heading>
      <Image
        my={2}
        size="xl"
        source={{ uri: "https://cdn.logo.com/hotlink-ok/logo-social.png" }}
        alt="Business Name"
      />
      <VStack space={6} mt={"10"} w={"80%"}>
        <Button _text={{ bold: true }}>{texts.openNewTab}</Button>
        <Button _text={{ bold: true }} colorScheme={"secondary"}>{texts.joinTab}</Button>
        <Button _text={{ bold: true }} colorScheme={"tertiary"}>{texts.viewMenu}</Button>
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
    </Center>
  )
}
