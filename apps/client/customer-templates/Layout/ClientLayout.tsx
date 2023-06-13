import React, { useEffect } from "react";
import { Box, Flex } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { useGetClientSession } from "../../hooks";
import { getClientCookies } from "../../cookies";
import { PathNameKeys, customerPathName, customerRoute } from "../../routes";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/init";

export const CustomerLayout: React.FC = ({ children }) => {
  const router = useRouter()
  const { productId, businessId } = router.query

  const token = getClientCookies(businessId as string)

  const isHome = router.pathname === customerRoute["/customer/[businessId]"]
  const isCheckout = router.pathname === customerRoute["/customer/[businessId]/checkout/[checkoutId]"]
  const isSettings = router.pathname === customerRoute["/customer/[businessId]/settings"]
  const isCart = router.pathname === customerRoute["/customer/[businessId]/cart"]
  const isSplit = router.pathname === customerRoute["/customer/[businessId]/split/[checkoutId]"]
  const { data } = useGetClientSession()

  useEffect(() => {
    if (!token && (isSettings || isCart || isSplit || isCheckout)) {
      if (!businessId || typeof businessId !== "string") return

      router.push({
        pathname: customerRoute["/customer/[businessId]"],
        query: {
          businessId
        }
      })
    }
  }, [isCart, isSettings, businessId, token, router, isSplit, isCheckout])

  useEffect(() => {

    analytics && logEvent(analytics, 'page_view', {
      app: 'customer',
      page_title: customerPathName[router.pathname as PathNameKeys],
      page_path: router.pathname,
    });

  }, [router.pathname])

  return (
    <Flex
      flexDirection="column"
      justifyContent={"space-between"}
      h={"100%"}
      bg={isSettings ? "gray.100" : "white"}>
      {data?.getClientSession.request?.status === "Pending" ?
        <Box position={"absolute"} zIndex={999} right={0} top={0} >
          <HourGlassAnimation />
        </Box> : null}
      {isHome ? null :
        <ClientNavBar tableNumber={data?.getClientSession.tab?.table?.tableNumber} />}
      <Box flex={1}>
        {children}
      </Box>
      {productId || isHome || isCheckout || isSplit || !token ? null :
        <ClientTabBar />}
    </Flex>
  );
};
