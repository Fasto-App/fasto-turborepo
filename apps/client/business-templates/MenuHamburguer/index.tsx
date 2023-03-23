import React from "react";
import { Divider, Menu, Text, Pressable, HStack, Avatar, VStack } from "native-base";
import { BusinessNavigationButton, NavigationButton } from "../../components/atoms/NavigationButton";
import { businessRoute } from "../../routes";
import { useRouter } from "next/router";
import { clearCookies } from "../../cookies/businessCookies";

const AccountTile = ({ isActive = false }: { isActive?: boolean }) => {
  return (
    <HStack flex={1} space={2}>
      <Avatar size={"lg"} source={{ uri: "https://bit.ly/dan-abramov" }} borderWidth={2} borderColor={isActive ? "primary.500" : "gray.400"} />
      <VStack flex={1} justifyContent="center">
        <Text fontSize={"24"} bold>Business Name</Text>
        {isActive ? <Text fontSize={"16"}>Employee Name</Text> : null}
      </VStack>
    </HStack>
  )
}

export function HamburgerMenu() {
  const router = useRouter();

  return <Menu
    placement="right bottom"
    trigger={triggerProps => {
      return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <AccountTile isActive />
      </Pressable>;
    }}>
    <Menu.Group title="Accounts">
      <Menu.Item>
        <AccountTile />
      </Menu.Item>
      <Menu.Item>
        <AccountTile />
      </Menu.Item>
    </Menu.Group>
    <Divider mt="3" w="100%" />
    <Menu.Item>
      <BusinessNavigationButton
        text={"Logout"}
        type={"Logout"}
        onPress={() => {
          clearCookies();
          router.push(businessRoute.login);
        }}
      />
    </Menu.Item>
  </Menu>

}