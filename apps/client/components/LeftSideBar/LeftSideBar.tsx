import { VStack } from "native-base"
import React, { PropsWithChildren } from "react"

export const LeftSideBar = ({ children }: PropsWithChildren<{}>) => (
  <VStack
    paddingX="2"
    space={1}
    w={"1/3"}
    minWidth={"240px"}
    maxWidth={"288px"}
    shadow={"8"}
  >
    {children}
  </VStack>
)