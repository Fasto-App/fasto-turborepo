import { TableStatus } from "../../gen/generated"

type statStruct = {
  number: number,
  name: TableStatus,
}

export const stats: Record<TableStatus, statStruct> = {
  OCCUPIED: {
    number: 1,
    name: TableStatus.Occupied
  },
  RESERVED: {
    number: 1,
    name: TableStatus.Reserved
  },
  AVAILABLE: {
    number: 1,
    name: TableStatus.Available
  },
  CLOSED: {
    number: 1,
    name: TableStatus.Closed
  }
}

export const borderColor = (status?: TableStatus) => {
  switch (status) {
    case "OCCUPIED":
      return "primary.600"
    case "RESERVED":
      return "muted.300"
    case "AVAILABLE":
      return "success.600"
    default:
      return "tertiary.600"
  }
}

export const badgeScheme = (status?: TableStatus) => {
  switch (status) {
    case "OCCUPIED":
      return "danger"
    case "RESERVED":
      return "coolGray"
    case "AVAILABLE":
      return "success"
    default:
      return "coolGray"
  }
}