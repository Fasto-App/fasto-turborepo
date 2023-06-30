import React from "react"
import { ApolloProvider } from "@apollo/client";
import { Box, NativeBaseProvider } from "native-base";

import { theme } from "../theme/colors";
import { AppApolloProvider } from "../apollo-client/AppApolloProvider";


export const StoryProvider = (story: any) =>
  <AppApolloProvider>
    <NativeBaseProvider theme={theme}>
      <Box height={"100vh"} width={"100vw"} p={"4"}>
        {story()}
      </Box>
    </NativeBaseProvider>
  </AppApolloProvider>