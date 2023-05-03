import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Box, Button, Center } from "native-base";
import { BusinessNavigationButton } from "../../components/atoms/NavigationButton";
import { AppNavigation, appRoute, businessRoute } from "../../routes";
import { LeftSideBar } from "../../components";
import { HamburgerMenu } from "../MenuHamburguer";
import { useTranslation } from "next-i18next";

const BusinessNavigationTab = () => {
  const router = useRouter();
  const useIsPageSelected = useMemo(() => (pathname: AppNavigation) =>
    pathname === router.pathname, [router.pathname])

  const { t } = useTranslation("common")

  return (
    <LeftSideBar>
      <Center
        alignItems={"center"}
        justifyContent={"center"}
        h={"full"}
      >
        <BusinessNavigationButton
          text={t("dashboard")}
          type={"Dashboard"}
          selected={useIsPageSelected(businessRoute.dashboard)}
          onPress={() => {
            router.push(businessRoute.dashboard);
          }}
        />
        <BusinessNavigationButton
          text={t("categoriesProducts")}
          type={"Fork"}
          selected={useIsPageSelected(businessRoute.add_products_categories)}
          onPress={() => {
            router.push(businessRoute.add_products_categories);
          }}
        />
        <BusinessNavigationButton
          text={t("menu")}
          type={"Menu"}
          selected={useIsPageSelected(businessRoute.menu)}
          onPress={() => {
            router.push(businessRoute.menu);
          }}
        />

        <BusinessNavigationButton
          text={t("tables")}
          type={"Table"}
          selected={useIsPageSelected(businessRoute.tables)}
          onPress={() => {
            router.push(businessRoute.tables);
          }}
        />
        <BusinessNavigationButton
          text={t("settings")}
          type={"Settings"}
          selected={useIsPageSelected(businessRoute.settings)}
          onPress={() => {
            router.push(businessRoute.settings);
          }}
        />
      </Center>
      <Box position={"absolute"} bottom={"0"} flex={1} pl={2} pb={4}>
        <Button w={"full"} mb={8}>
          {t("quickSale")}
        </Button>
        <HamburgerMenu />
      </Box>
    </LeftSideBar>
  );
};

export { BusinessNavigationTab };
