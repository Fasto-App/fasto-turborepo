import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Button, Center, VStack } from "native-base";
import { BusinessNavigationButton } from "../../components/atoms/NavigationButton";
import { AppNavigation, appRoute, businessRoute } from "../../routes";
import { LeftSideBar } from "../../components";
import { AccountMenu } from "../MenuHamburguer";
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
          text={t("placedOrders")}
          type={"ClipBoard"}
          selected={useIsPageSelected(businessRoute.orders)}
          onPress={() => {
            router.push(businessRoute.orders);
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
        <VStack space={10} bottom={0} position={"absolute"} p="4" w={"full"}>
          <Button
            _text={{ bold: true }}
            onPress={() => router.push(businessRoute.add_to_order)}>
            {t("quickSale")}
          </Button>
          <AccountMenu />
        </VStack>
      </Center>
    </LeftSideBar>
  );
};

export { BusinessNavigationTab };
