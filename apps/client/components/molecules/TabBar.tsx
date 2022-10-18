import React, { useMemo } from "react";
import { StyleSheet } from "react-native-web";
// import { colors } from "shared/theme";
import { useRouter } from "next/router";
import { colors } from "../../theme/colors";
import { NavigationButton } from "../atoms/NavigationButton";
import { NavigationButtonType } from "../types";
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
    <Box style={styles.container} paddingY={"1"} paddingX={"16"} ref={ref}>
      <NavigationButton
        type={NavigationButtonType.ListStar}
        selected={isMenu}
        text="Menu"
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
    </Box>
  );
});

TabBar.displayName = "TabBar"

export { TabBar };


const styles = StyleSheet.create({
  touchableArea: {
    minWidth: 20,
    minHeight: 20,
    padding: 5,
    alignItems: "center",
    borderColor: colors.pureWhite,
    // borderWidth: 1,
  },
  container: {
    // position: "absolute",
    width: "100%",
    backgroundColor: colors.blueboard,
    borderColor: colors.darkBlue,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 50,
    // paddingVertical: 10,
    bottom: 0,
    // flex: 1,
    // maxHeight: 60
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
