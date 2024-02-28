import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Button, Center, VStack, Image } from "native-base";
import { BusinessNavigationButton } from "../../components/atoms/NavigationButton";
import { businessRoute } from "fasto-route";
import type { AppNavigation } from "fasto-route";
import { LeftSideBar } from "../../components/LeftSideBar/LeftSideBar";
import { AccountMenu } from "../../components/MenuHamburguer";
import { useTranslation } from "next-i18next";
import { useGetSignUpSubscriptionsQuery } from "../../gen/generated";

const BusinessNavigationTab = () => {
  const router = useRouter();
  const useIsPageSelected = useMemo(() => (pathname: AppNavigation) =>
    pathname === router.pathname, [router.pathname])

  const { data } = useGetSignUpSubscriptionsQuery()
  const { t } = useTranslation("common")

  return (
    <LeftSideBar>
      <Center>
        <Image src="/images/fasto-logo.svg"
          alt="Fasto Logo"
          height={36} width={180} />
      </Center>
      <Center      >
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
          selected={useIsPageSelected(businessRoute["add-products-categories"])}
          onPress={() => {
            router.push(businessRoute["add-products-categories"]);
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
          text={t("payments")}
          type={"Payment"}
          selected={useIsPageSelected(businessRoute.payments)}
          onPress={() => {
            router.push(businessRoute.payments);
          }}
        />
        <BusinessNavigationButton
          text={t("subscriptions")}
          type={"Calendar"}
          selected={useIsPageSelected(businessRoute.subscriptions)}
          onPress={() => {
            router.push(businessRoute.subscriptions);
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
      <VStack space={10} bottom={0} paddingX={2} w={"full"}>
        <Button
          isDisabled={!data?.getSignUpSubscription?.tier ||
            data?.getSignUpSubscription?.tier === "Basic Plan"}
          _text={{ bold: true }}
          onPress={() => router.push(businessRoute["add-to-order"])}>
          {t("quickSale")}
        </Button>
        <AccountMenu />
      </VStack>
    </LeftSideBar>
  );
};

export { BusinessNavigationTab };
