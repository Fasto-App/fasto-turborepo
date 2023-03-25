import React, { useEffect } from "react";
import { Box, Flex } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { useGetTabInformation, useGetTabRequest } from "../../hooks";
import { getClientCookies } from "../../cookies/businessCookies";
import { clientRoute } from "../../routes";

const ClientLayout: React.FC = ({ children }) => {
  const token = getClientCookies("token")
  const route = useRouter()
  const { productId } = route.query
  const isHome = route.pathname === "/client/[businessId]"
  const isCheckout = route.pathname === "/client/[businessId]/checkout/[checkoutId]"
  const isSettings = route.pathname === "/client/[businessId]/settings"
  const isCart = route.pathname === "/client/[businessId]/cart"
  const { data } = useGetTabRequest()
  const { data: tab } = useGetTabInformation()

  useEffect(() => {
    if (!token && (isSettings || isCart)) {
      route.push(clientRoute.home(route.query.businessId as string))
    }
  }, [isCart, isSettings, route, token])

  return (
    <Flex
      flexDirection="column"
      justifyContent={"space-between"}
      h={"100%"}
      bg={route.pathname === "/client/[businessId]/settings" ? "gray.100" : "white"}>
      {data?.getTabRequest?.status === "Pending" ?
        <Box position={"absolute"} zIndex={999} right={0} top={0} >
          <HourGlassAnimation />
        </Box> : null}
      {isHome ? null :
        <ClientNavBar tableNumber={tab?.getTabByID?.table.tableNumber} />}
      <Box flex={1}>
        {children}
      </Box>
      {productId || isHome || isCheckout || !token ? null :
        <ClientTabBar />}
    </Flex>
  );
};

export { ClientLayout };
