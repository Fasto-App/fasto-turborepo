import React, { createContext, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
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

const AppWrapper = ({ children }) => {
  const isSSR = useIsSsr()
  return isSSR ? null : <View style={styles.wrapper}>{children}</View>
}

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(clientAppInitialState);


  return (
    // @ts-ignore
    < AppContext.Provider value={{ state, setState }}>
      <AppWrapper>
        {children}
      </AppWrapper>
    </ AppContext.Provider >
  )
}

export const useClientContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useClientContext must be used within the AppProvider");
  }

  return context
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: colors.pureWhite,
    height: "100vh",
  },
});