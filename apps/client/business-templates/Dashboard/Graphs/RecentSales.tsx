import React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";

const data = new Array(5).fill(({
  name: "Olivia Martin",
  email: "olivia.martin@email.com",
  amount: "$1,999.00",
}))

export function RecentSales() {
  return (
    <div className="space-y-8">
      {data.map((item, i) =>
        <div key={item + i} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-md font-medium leading-none">Olivia Martin</p>
            <p className="text-md text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      )}
    </div>
  )
}