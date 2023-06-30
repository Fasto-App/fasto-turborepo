import { VStack } from "native-base"
import React, { PropsWithChildren } from "react"

export const LeftSideBar = ({ children }: PropsWithChildren<{}>) => (
  <VStack
    justifyContent={"space-between"}
    w={"285"}
    shadow={"8"}
    paddingY={4}
    paddingX={2}
  >
    {children}
  </VStack>
)