import { Box, Container } from "native-base";
import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { useIsSsr } from "../hooks";
import { colors } from "../theme/colors";

const clientAppInitialState = {
  selectedItem: null,
  modifyItem: null,
}

const AppContext = createContext({
  state: clientAppInitialState,
  setState: () => undefined
})

const AppWrapper = ({ children }: PropsWithChildren<{}>) => {
  const isSSR = useIsSsr()
  return isSSR ? null : <>{children}</ >
}

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(clientAppInitialState);


  return (
    // @ts-ignore
    <AppContext.Provider value={{ state, setState }}>
      <AppWrapper>
        {children}
      </AppWrapper>
    </ AppContext.Provider>
  )
}

export const useClientContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useClientContext must be used within the AppProvider");
  }

  return context
}
