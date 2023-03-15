import { TableStatus } from "../../gen/generated"

type statStruct = {
  number: number,
  name: TableStatus,
}

export const stats: Record<TableStatus, statStruct> = {
  Occupied: {
    number: 1,
    name: TableStatus.Occupied
  },
  Reserved: {
    number: 1,
    name: TableStatus.Reserved
  },
  Available: {
    number: 1,
    name: TableStatus.Available
  },
  Closed: {
    number: 1,
    name: TableStatus.Closed
  }
}

export const borderColor = (status?: TableStatus) => {
  switch (status) {
    case "Occupied":
      return "primary.600"
    case "Reserved":
      return "muted.300"
    case "Available":
      return "tertiary.700"
    default:
      return "tertiary.600"
  }
}

export const badgeScheme = (status?: TableStatus) => {
  switch (status) {
    case "Occupied":
      return "danger"
    case "Reserved":
      return "coolGray"
    case "Available":
      return "success"
    default:
      return "coolGray"
  }
}