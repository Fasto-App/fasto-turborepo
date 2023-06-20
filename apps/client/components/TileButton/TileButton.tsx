import { Button } from 'native-base'
import React from 'react'

type TileButtonProps = {
  selected?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
}

export const TileButton: React.FC<TileButtonProps> = ({ selected, onPress, children, isDisabled }) => {
  return (
    <Button
      px={4}
      m={0}
      minW={"100px"}
      maxH={"40px"}
      isDisabled={isDisabled}
      borderColor={selected ? 'primary.500' : "gray.300"}
      variant={selected ? 'outline' : 'outline'}
      colorScheme={selected ? "primary" : "black"}
      onPress={onPress}
    >
      {children}
    </Button>
  )
}
