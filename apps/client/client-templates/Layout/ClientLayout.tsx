import React from "react";
import { Box, Flex, ScrollView } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";

const ClientLayout: React.FC = ({ children }) => {
  // for productDescription page don't display TabBar
  // if (children.props?.route?.pathname === "/client/production_description") {
  const route = useRouter()
  const { productId } = route.query

  const isHome = route.pathname === "/client/[businessId]"

  // some flag that will hide the tab bar and the navigation bar

  // route is /client/businessId only 

  console.log("route", route)

  console.log("route", route)
  return (
    <Flex
      flexDirection="column"
      justifyContent={"space-between"}
      h={"100%"}
      bg={"white"}>
      {isHome ? null : <ClientNavBar />}
      <Box flex={1}>
        {children}
      </Box>
      {productId || isHome ? null : <ClientTabBar />}
    </Flex>
  );
};

export { ClientLayout };
