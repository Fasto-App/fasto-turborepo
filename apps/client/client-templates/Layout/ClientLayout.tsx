import React from "react";
import { Box, Flex } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { useGetTabRequest } from "../../hooks";
import { getClientCookies } from "../../cookies/businessCookies";

const ClientLayout: React.FC = ({ children }) => {
  const route = useRouter()
  const { productId } = route.query
  const isHome = route.pathname === "/client/[businessId]"
  const isCheckout = route.pathname === "/client/[businessId]/checkout/[checkoutId]"
  const { data } = useGetTabRequest()
  const token = getClientCookies("token")


  return (
    <Flex
      flexDirection="column"
      justifyContent={"space-between"}
      h={"100%"}
      bg={route.pathname === "/client/[businessId]/settings" ? "gray.100" : "white"}>
      {isHome ? null : <ClientNavBar />}
      <Box flex={1}>
        {children}
      </Box>
      {productId || isHome || isCheckout || !token ? null : <ClientTabBar />}

      {data?.getTabRequest?.status === "Pending" ?
        <Box position={"absolute"} zIndex={999} right={0} top={0} >
          <HourGlassAnimation />
        </Box> : null}
    </Flex>
  );
};

export { ClientLayout };
