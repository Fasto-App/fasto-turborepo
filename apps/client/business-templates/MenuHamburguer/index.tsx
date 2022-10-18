import React from "react";
import { Box, Menu, HamburgerIcon, Pressable } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";
import { businessRoute } from "../../routes";
import { useRouter } from "next/router";

export function HamburgerMenu() {
  const router = useRouter();


  return <Box pl={"4"} h="80%" alignItems="flex-start">
    <Menu w="190" trigger={triggerProps => {
      return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <HamburgerIcon color="white" />
      </Pressable>;
    }}>
      <Menu.Item>
        <NavigationButton
          flexDirection={"row"}
          text={"Add Products"}
          type={NavigationButtonType.Plus}
          selected={false}
          onPress={() => {
            router.push(businessRoute.add_products_categories);
          }}
        />
      </Menu.Item>
      <Menu.Item>Nunito Sans</Menu.Item>
      <Menu.Item>Roboto</Menu.Item>
      <Menu.Item>Poppins</Menu.Item>
      <Menu.Item>SF Pro</Menu.Item>
      <Menu.Item>Helvetica</Menu.Item>
      <Menu.Item isDisabled>Sofia</Menu.Item>
      <Menu.Item>Cookie</Menu.Item>
    </Menu>
  </Box>;
}