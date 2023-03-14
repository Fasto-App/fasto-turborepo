import React from "react";
import { Box, Flex, ScrollView } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";
import { useRouter } from "next/router";
import { PathNameKeys } from "../../routes";

const ClientLayout: React.FC = ({ children }) => {
  const route = useRouter()
  const { productId } = route.query
  const isHome = route.pathname === "/client/[businessId]"


  // para essa rota essa cora para aquela 

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
      {productId || isHome ? null : <ClientTabBar />}
    </Flex>
  );
};

export { ClientLayout };
