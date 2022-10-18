import React from "react";
import { Box } from "native-base";

const BusinessScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return <Box
    flex={1} m={0} p={0} h={"100vh"} flexDirection={"row"} backgroundColor={"white"}
  >{children}</Box>;
};

export { BusinessScreenContainer };
