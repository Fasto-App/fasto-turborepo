import { Button } from 'native-base'
import React from 'react'

type TileButtonProps = {
  selected?: boolean
  onPress?: () => void
}

export const TileButton: React.FC<TileButtonProps> = ({ selected, onPress, children }) => {
  return (
    <Button
      px={4}
      m={0}
      minW={"100px"}
      maxH={"40px"}
      borderColor={selected ? 'primary.500' : "gray.300"}
      disabled={selected}
      variant={selected ? 'outline' : 'outline'}
      colorScheme={selected ? "primary" : "black"}
      onPress={onPress}
    >
      {children}
    </Button>
  )
}
