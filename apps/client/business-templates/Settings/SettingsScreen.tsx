import React from 'react'
import { Settings } from './Settings'
import { Box } from 'native-base'

function SettingsScreen() {
  return (
    <Box flex={1}>
      <Box backgroundColor={"primary.500"} h={100} w={"100%"} position={"absolute"} zIndex={-1} />
      <Settings />
    </Box>
  )
}


export { SettingsScreen }