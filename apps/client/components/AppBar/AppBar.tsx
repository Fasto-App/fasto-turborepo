import React from "react"
import { Box, HStack, StatusBar, Text } from "native-base"
import { HamburgerMenu } from "../../business-templates/MenuHamburguer"
import { useRouter } from "next/router"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const AppBar = () => {
  const router = useRouter()
  const pathname = router.pathname.split("/")
  const route = pathname[pathname.length - 1].replace("-", " ")

  return (
    <>
      <StatusBar backgroundColor={"#3700B3"} barStyle="light-content" />
      <Box safeAreaTop bg="#6200ee" />
      <HStack p={"5"} bg="primary.500" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <HStack alignItems="center" w={"100%"}>
          {/* <IconButton icon={<Icon size="sm" as={MaterialIcons} name="menu" color="white" />} /> */}
          <HamburgerMenu />
          <Text pl={"4"} width={"100%"} color="white" fontWeight="bold" fontSize={"xl"}>{capitalizeFirstLetter(route)}</Text>
        </HStack>
        <HStack>
          {/* <IconButton icon={<Icon as={MaterialIcons} name="favorite" size="sm" color="white" />} />
        <IconButton icon={<Icon as={MaterialIcons} name="search" size="sm" color="white" />} />
        <IconButton icon={<Icon as={MaterialIcons} name="more-vert" size="sm" color="white" />} /> */}
        </HStack>
      </HStack>
    </>
  )
}

