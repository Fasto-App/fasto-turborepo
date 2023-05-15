import { VStack } from "native-base"
import React, { PropsWithChildren } from "react"

export const LeftSideBar = ({ children }: PropsWithChildren<{}>) => (
  <VStack
    space={1}
    w={"1/4"}
    minWidth={"240px"}
    maxWidth={"288px"}
    shadow={"8"}
    justifyContent={"space-between"}
    paddingY={4}
    paddingX={2}
  >
    {children}
  </VStack>
)