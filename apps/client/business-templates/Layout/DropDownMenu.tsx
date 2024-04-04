import React from "react"
import { Button } from "@/shadcn/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/shadcn/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"

type AccountTileProps = {
  businessName?: string | null;
  employeeName?: string | null;
  uri?: string | null;
  isOpen?: boolean;
}

export function AvatarDemo({
  businessName,
  uri,
  isOpen,
}: AccountTileProps) {
  return (

    <div className="duration-200 ease-out flex flex-row justify-between items-center gap-4 p-4">
      <Avatar>
        <AvatarImage
          src={uri || ""} alt={`${businessName} logo`}
          className="aspect-auto"
        />
        <AvatarFallback>{businessName}</AvatarFallback>
      </Avatar>

      {isOpen ? <p className="leading-7 text-black text-[18px]">
        {businessName}
      </p> : null}
    </div>
  )
}

export function DropdownMenuSideBar(props: AccountTileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="border border-red-500 p-4 bt-transparent ">
          <AvatarDemo {...props} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto bg-gray-50 cursor-pointer">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
