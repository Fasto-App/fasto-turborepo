import { PresenceTransition } from 'native-base'
import React, { PropsWithChildren } from 'react'

function Transition({
  isVisible,
  children
}: PropsWithChildren<{
  isVisible: boolean
}>) {
  return (
    <PresenceTransition
      visible={isVisible}
      initial={{ opacity: 0, }}
      animate={{
        opacity: 1,
        transition: {
          duration: 250
        }
      }}>
      {children}
    </PresenceTransition>
  )
}

export { Transition }