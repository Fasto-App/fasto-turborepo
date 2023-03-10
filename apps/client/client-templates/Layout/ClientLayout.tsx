import React from "react";
import { Box, Flex, ScrollView } from "native-base";
import { ClientNavBar } from "./ClientNavbar";
import { ClientTabBar } from "./ClientTabBar";

const ClientLayout: React.FC = ({ children }) => {
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
      <ClientTabBar />
    </Flex>
  );
};

export { ClientLayout };
