import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { NavigationButton } from "../atoms/NavigationButton";
import { AppNavigation, clientRoute } from "../../routes";
import { Box } from "native-base";


const TabBar = React.forwardRef((props, ref) => {
  const router = useRouter();

  const useIsPageSelected = useMemo(() => (pathname: AppNavigation) =>
    pathname === router.pathname, [router.pathname])

  const isMenu = useIsPageSelected(clientRoute.menu);
  const isCart = useIsPageSelected(clientRoute.cart);
  const isCheckout = useIsPageSelected(clientRoute.checkout);
  const isSettings = useIsPageSelected(clientRoute.settings);

  return (
    <Box paddingY={"1"} paddingX={"16"} ref={ref}>
      <NavigationButton
        type={"ListStar"}
        selected={isMenu}
        text="Menu"
        onPress={() => {
          router.push("/");
        }}
      />
      <NavigationButton
        type={"Bag"}
        selected={isCart}
        onPress={() => {
          router.push(clientRoute.menu("ronaldo"));
        }}
      />
      <NavigationButton
        type={"Payment"}
        selected={isCheckout}
        onPress={() => {
          router.push(clientRoute.menu("ronaldo"));
        }}
      />
      <NavigationButton
        type={"Radio"}
        selected={isSettings}
        onPress={() => {
          router.push(clientRoute.menu("ronaldo"));
        }}
      />
    </Box>
  );
});

TabBar.displayName = "TabBar"

export { TabBar };

