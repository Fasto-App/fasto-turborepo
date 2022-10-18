import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Box, VStack } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";
import { AppNavigation, appRoute, businessRoute, BUSINESS_ADMIN } from "../../routes";
import { clearCookies } from "../../cookies/businessCookies";

// take care of the sorounding code

const navigationTitle = {
  dashboard: "Dashboard",
  categories_products: "Categories / Products",
  menu: "Menu",
  tables: "Manage Tabs",
  settings: "Settings",
  logout: "Logout"
}


const BusinessNavigationTab = () => {
  const router = useRouter();
  const useIsPageSelected = useMemo(() => (pathname: AppNavigation) =>
    pathname === router.pathname, [router.pathname])

  const isHome = useIsPageSelected(appRoute.home)
  const isAddProductsCategories = useIsPageSelected(businessRoute.add_products_categories)


  return (
    <VStack
      alignItems={"center"}
      h={"100vh"}
      justifyContent={"center"}
      paddingX="2"
      space={1}
      w={"288"}
      borderRightWidth={1}
    >
      <NavigationButton
        flexDirection={"row"}
        text={navigationTitle.dashboard}
        type={NavigationButtonType.Dashboard}
        selected={useIsPageSelected(businessRoute.dashboard)}
        onPress={() => {
          router.push(businessRoute.dashboard);
        }}
      />
      <NavigationButton
        flexDirection={"row"}
        text={navigationTitle.categories_products}
        type={NavigationButtonType.Fork}
        selected={useIsPageSelected(businessRoute.add_products_categories)}
        onPress={() => {
          router.push(businessRoute.add_products_categories);
        }}
      />
      <NavigationButton
        flexDirection={"row"}
        text={navigationTitle.menu}
        type={NavigationButtonType.Menu}
        selected={useIsPageSelected(businessRoute.menu)}
        onPress={() => {
          router.push(businessRoute.menu);
        }}
      />

      <NavigationButton
        flexDirection={"row"}
        text={navigationTitle.tables}
        type={NavigationButtonType.Table}
        selected={useIsPageSelected(businessRoute.tables)}
        onPress={() => {
          router.push(businessRoute.tables);
        }}
      />
      <NavigationButton
        flexDirection={"row"}
        text={navigationTitle.settings}
        type={NavigationButtonType.Settings}
        selected={useIsPageSelected(businessRoute.settings)}
        onPress={() => {
          router.push(businessRoute.settings);
        }}
      />

      {/* <Box display="fixed" position="fixed" p={"1"} bottom={0}> */}
      <NavigationButton
        flexDirection={"row"}
        text={navigationTitle.logout}
        type={NavigationButtonType.Logout}
        selected={useIsPageSelected(businessRoute.login)}
        onPress={() => {
          clearCookies();
          router.push(businessRoute.login);
        }}
      />
      {/* </Box> */}
    </VStack>
  );
};

export { BusinessNavigationTab };
