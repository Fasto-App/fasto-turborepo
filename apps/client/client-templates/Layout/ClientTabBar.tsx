import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { clientRoute } from "../../routes";
import { HStack, useBreakpointValue } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";


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
        type={"ListStar"}
        selected={isMenu}
        onPress={() => {
          router.push(clientRoute.menu("123"));
        }}
      />
      <NavigationButton
        type={"Bag"}
        selected={isCart}
        onPress={() => {
          router.push(clientRoute.cart);
        }}
      />
      <NavigationButton
        type={"Payment"}
        selected={isCheckout}
        onPress={() => {
          router.push(clientRoute.production_description("123"));
        }}
      />
      <NavigationButton
        type={"Radio"}
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
