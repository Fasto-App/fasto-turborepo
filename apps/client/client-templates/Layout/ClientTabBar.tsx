import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { clientRoute } from "../../routes";
import { HStack, useBreakpointValue } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { useGetTabRequest } from "../../hooks";


const ClientTabBar: React.FC = (props) => {
  const router = useRouter();
  const { businessId } = router.query

  const useIsPageSelected = useCallback((pathname: string) =>
    pathname === router.asPath, [router.asPath])

  const isMenu = useIsPageSelected(clientRoute.menu(businessId as string));
  const isCart = useIsPageSelected(clientRoute.cart(businessId as string));
  const isCheckout = useIsPageSelected(clientRoute.checkout(businessId as string));
  const isSettings = useIsPageSelected(clientRoute.settings(businessId as string));

  const { data: tabData } = useGetTabRequest()

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
        disabled={tabData?.getTabRequest?.status === "Pending"}
        selected={isCart}
        numNotifications={9}
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
