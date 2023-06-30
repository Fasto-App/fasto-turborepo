import { Box } from "native-base"
import React, { PropsWithChildren } from "react"


export const BottomSection = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box
      p={"4"}
      flex={1}
      borderWidth={1}
      borderRadius={"md"}
      borderColor={"trueGray.400"}
      backgroundColor={"white"}
      overflow={"hidden"}
    >
      {children}
    </Box>)

}