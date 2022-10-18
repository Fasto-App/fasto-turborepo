import React from "react"
import { ApolloProvider } from "@apollo/client";
import { Box, NativeBaseProvider } from "native-base";
import { client } from "../apollo-client/client";
import { theme } from "../theme/colors";


export const StoryProvider = (story: any) =>
  <ApolloProvider client={client}>
    <NativeBaseProvider theme={theme}>
      <Box height={"100vh"} width={"100vw"} p={"4"}>
        {story()}
      </Box>
    </NativeBaseProvider>
  </ApolloProvider>