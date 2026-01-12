import React from "react"
import { useGetNotificationByBusinessQuery } from "@/gen/generated"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/components/ui/tooltip"
import { BellIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

export const NotificationBadge = () => {
  const { data, loading } = useGetNotificationByBusinessQuery({
    variables: {
      input: {
        isRead: false
      }
    },
    onError(error) {
      toast.error(("error Creating Orders"), {
        action: {
          label: "Ok",
          onClick: () => console.log("Undo"),
        },
      })
    },
  })
  // function call to get all the not read notifications
  return (
    <div className="absolute z-40 top-4 right-40 pt-4 px-2">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <div className="py-[1px] px-2 bg-error-600 rounded-full text-white absolute -top-[0.1px] -right-1 p-0">
              {loading || !data?.getNotificationByBusiness?.length ? null :
                <p className='text-sm font-medium'>
                  {data?.getNotificationByBusiness?.length}
                </p>}
            </div>
            <BellIcon className='h-6 w-6 text-white bg-error-600 rounded-sm' />
          </TooltipTrigger>
          <TooltipContent align="end" className="bg-white p-2 rounded-md w-68 border border-gray-200">
            <div className="grid grid-cols-1 gap-2">
              {data?.getNotificationByBusiness?.map(not => (
                <div className="bg-white p-2 rounded-md border border-gray-200" key={not._id}>
                  <p className="text-sm text-gray-500 font-medium truncate">{not.message}</p>
                  <p className="text-xs text-gray-500 truncate">{not.path}</p>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}