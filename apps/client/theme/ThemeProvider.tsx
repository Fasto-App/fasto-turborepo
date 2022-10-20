import React, { PropsWithChildren } from "react"
import { NativeBaseProvider } from "native-base"
import { theme } from "./colors"

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>
}
