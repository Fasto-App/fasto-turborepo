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

  console.log("route", route)
  return (
    <Flex
      flexDirection="column"
      justifyContent={"space-between"}
      h={"100%"}
      bg={"white"}>
      <ClientNavBar />
      <Box flex={1}>
        {children}
      </Box>
      {productId ? null : <ClientTabBar />}
    </Flex>
  );
};

export { ClientLayout };
