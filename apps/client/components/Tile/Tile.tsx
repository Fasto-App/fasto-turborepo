import React from "react"
import { Button, HStack, Skeleton } from "native-base"

type TileProps = {
  selected: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({
  children,
  selected,
  onPress,
}) => {
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

export const TileLoading = () => {
  return (
    <HStack space={4}>
      <Skeleton borderRadius={"md"} w={"100px"} />
      <Skeleton borderRadius={"md"} w={"100px"} />
      <Skeleton borderRadius={"md"} w={"100px"} />
    </HStack>
  )
}