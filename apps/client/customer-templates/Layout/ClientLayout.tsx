import React, { useEffect } from "react";
import { Box, Flex } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { useGetClientSession } from "../../hooks";
import { getClientCookies } from "../../cookies";
import { customerRoute, customerTitlePath } from "../../routes";

export const CustomerLayout: React.FC = ({ children }) => {
  const route = useRouter()
  const { productId, businessId } = route.query

  const token = getClientCookies(businessId as string)

  const isHome = route.pathname === customerTitlePath.Home
  const isCheckout = route.pathname === customerTitlePath.Checkout
  const isSettings = route.pathname === customerTitlePath.Settings
  const isCart = route.pathname === customerTitlePath.Cart
  const isSplit = route.pathname === customerTitlePath.Split
  const { data } = useGetClientSession()

  useEffect(() => {
    if (!token && (isSettings || isCart)) {
      if (!businessId || typeof businessId !== "string") return

      route.push({
        pathname: customerRoute.home,
        query: {
          businessId
        }
      })
    }
  }, [isCart, isSettings, businessId, token, route])

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
