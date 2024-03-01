import React from "react"
import { Button, HStack } from "native-base"
import { Skeleton } from "@/shadcn/components/ui/skeleton";

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

export function NewTileLoading() {
  return <Skeleton className="h-10 w-24 rounded-xl" />
}
export const TileLoading = () => {
  return (
    <HStack space={4}>
      <Skeleton className="h-10 w-24 rounded-xl" />
      <Skeleton className="h-10 w-24 rounded-xl" />
      <Skeleton className="h-10 w-24 rounded-xl" />
    </HStack>
  )
}