import React from 'react'
import PropTypes from 'prop-types'
import { Settings } from './Settings'
import { Box } from 'native-base'

function SettingsScreen(props) {
  return (
    <Box flex={1}>
      <Settings />
    </Box>
  )
}


export { SettingsScreen }