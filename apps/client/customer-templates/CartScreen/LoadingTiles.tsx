import React from "react"
import { Box, Skeleton } from "native-base"

export const LoadingCartItems = () => {
  return (
    <Box>
      {new Array(5).fill({}).map((_, i) => (
        <Skeleton
          key={i}
          p={1}
          borderRadius={"md"}
          startColor={i % 2 === 0 ? "secondary.200" : "gray.200"}
        />
      )
      )}
    </Box>
  )
}
