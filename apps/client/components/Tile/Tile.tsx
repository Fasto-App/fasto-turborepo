import React from "react"
import { HStack } from "native-base"
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";

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
    <div
      className={cn("p-1 sm:p-4 m-0 w-md text-md max-h-7 shadow-md text-black border border-gray-400 rounded-md content-center hover:text-primary-600 hover:border-primary-500 hover:cursor-pointer", selected ? 'bg-primary-100 border border-primary-600 text-primary-600 font-semibold' : null)}
      onClick={onPress}
    >
      {children}
    </div>
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