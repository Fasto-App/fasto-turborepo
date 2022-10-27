import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Box, Center, VStack } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";
import { AppNavigation, appRoute, businessRoute, BUSINESS_ADMIN } from "../../routes";
import { clearCookies } from "../../cookies/businessCookies";
import { LeftSideBar } from "../../components";

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
    <LeftSideBar>
      <Center
        alignItems={"center"}
        justifyContent={"center"}
        h={"full"}
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
      </Center>
    </LeftSideBar>
  );
};

export { BusinessNavigationTab };
