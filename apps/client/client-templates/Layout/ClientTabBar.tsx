import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { clientPathName, clientRoute, ClientTitlePathKeys, clientTitlePath } from "../../routes";
import { HStack, useBreakpointValue } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { useGetClientSession } from "../../hooks";


const ClientTabBar: React.FC = (props) => {
  const router = useRouter();
  const { businessId } = router.query

  const useIsPageSelected = useCallback((pathname: ClientTitlePathKeys, slug?: string) => {
    if (typeof businessId !== "string") return false;

    const pathName = clientTitlePath[pathname]

    return router.pathname === pathName;

  }, [businessId, router.pathname])

  const isMenu = useIsPageSelected("Menu");
  const isCart = useIsPageSelected("Cart");
  const isSettings = useIsPageSelected("Settings");


  const { data: tabData } = useGetClientSession()

  const paddingX = useBreakpointValue({
    base: "8",
    lg: "16"
  });

  if (!businessId || typeof businessId !== "string") return null;

  return (
    <HStack
      w={"100%"}
      justifyContent={"space-between"}
      paddingY={"2"}
      paddingX={paddingX}
      bg={"primary.500"}
    >
      <NavigationButton
        type={"ListStar"}
        selected={isMenu}
        onPress={() => {
          router.push(clientRoute.menu(businessId));
        }}
      />
      <NavigationButton
        type={"Bag"}
        disabled={!tabData?.getClientSession.tab}
        selected={isCart}
        numNotifications={tabData?.getClientSession.tab?.cartItems?.length}
        onPress={() => {
          router.push(clientRoute.cart(businessId));
        }}
      />
      <NavigationButton
        type={"Settings"}
        selected={isSettings}
        onPress={() => {
          router.push(clientRoute.settings(businessId));
        }}
      />
    </HStack>
  );
};

ClientTabBar.displayName = "ClientTabBar"

export { ClientTabBar };
//miscelanious