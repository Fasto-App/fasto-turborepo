import React from "react"
import { HStack } from "native-base"
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";

type TileProps = {
  selected: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null
}

export const Tile: React.FC<TileProps> = ({
  children,
  selected,
  onPress,
  variant
}) => {
  return (
    <Button
      className={cn("px-2 m-0 w-md text-md max-h-7 hover:bg-transparent hover:text-none hover:border-primary-500 ", selected ? 'bg-primary-100 border-primary-500  text-primary-600 font-semibold' : "border-gray-300 text-black")}
      variant={variant}
      disabled={selected}
      onClick={onPress}
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