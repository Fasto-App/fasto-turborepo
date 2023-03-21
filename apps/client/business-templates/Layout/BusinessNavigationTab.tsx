import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Box, Center } from "native-base";
import { BusinessNavigationButton } from "../../components/atoms/NavigationButton";
import { AppNavigation, appRoute, businessRoute } from "../../routes";
import { LeftSideBar } from "../../components";
import { HamburgerMenu } from "../MenuHamburguer";

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

  return (
    <LeftSideBar>
      <Center
        alignItems={"center"}
        justifyContent={"center"}
        h={"full"}
      >
        <BusinessNavigationButton
          text={navigationTitle.dashboard}
          type={"Dashboard"}
          selected={useIsPageSelected(businessRoute.dashboard)}
          onPress={() => {
            router.push(businessRoute.dashboard);
          }}
        />
        <BusinessNavigationButton
          text={navigationTitle.categories_products}
          type={"Fork"}
          selected={useIsPageSelected(businessRoute.add_products_categories)}
          onPress={() => {
            router.push(businessRoute.add_products_categories);
          }}
        />
        <BusinessNavigationButton
          text={navigationTitle.menu}
          type={"Menu"}
          selected={useIsPageSelected(businessRoute.menu)}
          onPress={() => {
            router.push(businessRoute.menu);
          }}
        />

        <BusinessNavigationButton
          text={navigationTitle.tables}
          type={"Table"}
          selected={useIsPageSelected(businessRoute.tables)}
          onPress={() => {
            router.push(businessRoute.tables);
          }}
        />
        <BusinessNavigationButton
          text={navigationTitle.settings}
          type={"Settings"}
          selected={useIsPageSelected(businessRoute.settings)}
          onPress={() => {
            router.push(businessRoute.settings);
          }}
        />
      </Center>
      <Box position={"absolute"} bottom={"0"} flex={1} pl={2} pb={4}>
        <HamburgerMenu />
      </Box>
    </LeftSideBar>
  );
};

export { BusinessNavigationTab };
