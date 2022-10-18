import React from "react"
import { NativeBaseProvider } from "native-base"
import { theme } from "./colors"

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>
}
