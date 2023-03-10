import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
// import { colors } from "shared/theme";
import { useRouter } from "next/router";
import { colors } from "../../theme/colors";
// import { NavigationButton } from "../atoms/NavigationButton";
// import { NavigationButtonType } from "../types";
import { AppNavigation, clientRoute } from "../../routes";
import { HStack, useBreakpointValue } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";


const ClientTabBar: React.FC = (props) => {
  const router = useRouter();
  const { businessId } = router.query

  const useIsPageSelected = useCallback((pathname: string) =>
    pathname === router.asPath, [router.asPath])

  const isMenu = useIsPageSelected(clientRoute.menu(businessId as string));
  const isCart = useIsPageSelected(clientRoute.cart);
  const isCheckout = useIsPageSelected(clientRoute.checkout);
  const isSettings = useIsPageSelected(clientRoute.settings);

  const paddingX = useBreakpointValue({
    base: "8",
    lg: "16"
  });

  return (
    <HStack
      w={"100%"}
      justifyContent={"space-between"}
      paddingY={"2"}
      paddingX={paddingX}
      bg={"primary.500"}
      safeAreaBottom={1}
    >
      <NavigationButton
        type={NavigationButtonType.ListStar}
        selected={isMenu}
        onPress={() => {
          router.push(clientRoute.menu("123"));
        }}
      />
      <NavigationButton
        type={NavigationButtonType.Bag}
        selected={isCart}
        onPress={() => {
          router.push(clientRoute.menu("123"));
        }}
      />
      <NavigationButton
        type={NavigationButtonType.Payment}
        selected={isCheckout}
        onPress={() => {
          router.push(clientRoute.production_description);
        }}
      />
      <NavigationButton
        type={NavigationButtonType.Radio}
        selected={isSettings}
        onPress={() => {
          router.push(clientRoute.settings);
        }}
      />
    </HStack>
  );
};

ClientTabBar.displayName = "ClientTabBar"

export { ClientTabBar };
