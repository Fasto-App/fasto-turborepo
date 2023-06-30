export const RequestStatus = {
  Pending: "Pending",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Canceled: "Canceled",
  Completed: "Completed",
  Expired: "Expired",
  Deleted: "Deleted",
} as const

export type RequestStatusType = typeof RequestStatus[keyof typeof RequestStatus]