import React, { useMemo } from "react";
import { StyleSheet } from "react-native-web";
// import { colors } from "shared/theme";
import { useRouter } from "next/router";
import { colors } from "../../theme/colors";
// import { NavigationButton } from "../atoms/NavigationButton";
// import { NavigationButtonType } from "../types";
import { AppNavigation, clientRoute } from "../../routes";
import { HStack, useBreakpointValue } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";


const ClientTabBar = (props) => {
  const router = useRouter();

  const useIsPageSelected = useMemo(() => (pathname: AppNavigation) =>
    pathname === router.pathname, [router.pathname])

  const isMenu = useIsPageSelected(clientRoute.menu);
  const isCart = useIsPageSelected(clientRoute.cart);
  const isCheckout = useIsPageSelected(clientRoute.checkout);
  const isSettings = useIsPageSelected(clientRoute.settings);

  const paddingX = useBreakpointValue({
    base: "8",
    lg: "16"
  });

  return (
    <HStack justifyContent={"space-between"} paddingY={"2"} paddingX={paddingX} bg={"primary.500"}>
      <NavigationButton
        type={NavigationButtonType.ListStar}
        selected={isMenu}
        onPress={() => {
          router.push("/");
        }}
      />
      <NavigationButton
        type={NavigationButtonType.Bag}
        selected={isCart}
        onPress={() => {
          router.push(clientRoute.menu);
        }}
      />
      <NavigationButton
        type={NavigationButtonType.Payment}
        selected={isCheckout}
        onPress={() => {
          router.push(clientRoute.menu);
        }}
      />
      <NavigationButton
        type={NavigationButtonType.Radio}
        selected={isSettings}
        onPress={() => {
          router.push(clientRoute.menu);
        }}
      />
    </HStack>
  );
};

ClientTabBar.displayName = "ClientTabBar"

export { ClientTabBar };


const styles = StyleSheet.create({
  touchableArea: {
    minWidth: 20,
    minHeight: 20,
    padding: 5,
    alignItems: "center",
    borderColor: colors.pureWhite,
    // borderWidth: 1,
  },
  iconContainer: {
    height: 20,
    width: 20,
    borderColor: colors.pureWhite,
    // borderWidth: 1,
  },
  icon: {
    stroke: "blue",
  },
  micro: {
    fontSize: 12,
    textAlign: "center",
  },
});
