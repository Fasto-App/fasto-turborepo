import React, { useEffect } from "react";
import { Box, Flex } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { useGetClientSession } from "../../hooks";
import { getClientCookies } from "../../cookies";
import { clientRoute } from "../../routes";

const ClientLayout: React.FC = ({ children }) => {
  const route = useRouter()
  const { productId, businessId } = route.query

  const token = getClientCookies(businessId as string)

  const isHome = route.pathname === "/client/[businessId]"
  const isCheckout = route.pathname === "/client/[businessId]/checkout/[checkoutId]"
  const isSettings = route.pathname === "/client/[businessId]/settings"
  const isCart = route.pathname === "/client/[businessId]/cart"
  const { data } = useGetClientSession()

  useEffect(() => {
    if (!token && (isSettings || isCart)) {
      if (!businessId || typeof businessId !== "string") return

      route.push(clientRoute.home(businessId))
    }
  }, [isCart, isSettings, businessId, token, route])

  return (
    <Flex
      flexDirection="column"
      justifyContent={"space-between"}
      h={"100%"}
      bg={route.pathname === "/client/[businessId]/settings" ? "gray.100" : "white"}>
      {data?.getClientSession.request?.status === "Pending" ?
        <Box position={"absolute"} zIndex={999} right={0} top={0} >
          <HourGlassAnimation />
        </Box> : null}
      {isHome ? null :
        <ClientNavBar tableNumber={data?.getClientSession.tab?.table?.tableNumber} />}
      <Box flex={1}>
        {children}
      </Box>
      {productId || isHome || isCheckout || !token ? null :
        <ClientTabBar />}
    </Flex>
  );
};

export { ClientLayout };
