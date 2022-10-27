import React from "react";
import { Box } from "native-base";

const BusinessScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return <Box
    flex={1}
    flexDirection={"row"}
    backgroundColor={"white"}
  >
    {children}
  </Box>;
};

export { BusinessScreenContainer };
