import React, { useEffect } from "react";
import { Box, Flex } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { useGetClientSession } from "../../hooks";
import { getClientCookies } from "../../cookies";
import { PathNameKeys, customerPathName, customerRoute } from "fasto-route";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/init";

export const CustomerLayout: React.FC = ({ children }) => {
  const router = useRouter()
  const { businessId } = router.query

  const token = getClientCookies(businessId as string)

  const isHome = router.pathname === customerRoute["/customer/[businessId]"]
  const isMenu = router.pathname === customerRoute["/customer/[businessId]/menu"]
  const isSettings = router.pathname === customerRoute["/customer/[businessId]/settings"]
  const isCart = router.pathname === customerRoute["/customer/[businessId]/cart"]
  const { data } = useGetClientSession()

  useEffect(() => {
    if (!token && !isHome) {
      if (!businessId) throw "No business associated"

      router.push({
        pathname: customerRoute["/customer/[businessId]"],
        query: {
          businessId
        }
      })
    }
  }, [isCart, isSettings, businessId, token, router, isHome])

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
      {isHome ? null :
        <ClientNavBar
          tableNumber={data?.getClientSession.tab?.table?.tableNumber}
          status={data?.getClientSession.request.status}
        />}
      <Box flex={1}>
        {children}
      </Box>
      {isMenu || isSettings || isCart && token ? <ClientTabBar /> : null}
    </Flex>
  );
};
