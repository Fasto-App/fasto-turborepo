import { PrivilegesKeys } from "app-helpers";

export const TableStatus = {
  Available: 'Available',
  Occupied: 'Occupied',
  Reserved: 'Reserved',
  Closed: 'Closed'
} as const;

export type TableStatusType = typeof TableStatus[keyof typeof TableStatus];

export const OrderStatus = {
  Open: 'Open',
  Pendent: 'Pendent',
  Delivered: 'Delivered',
  Closed: 'Closed'
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const TabStatus = {
  Open: 'Open',
  Pendent: 'Pendent',
  Closed: 'Closed'
} as const

export type TabStatusType = typeof TabStatus[keyof typeof TabStatus];

export type BusinessRelationship = {
  privilege: PrivilegesKeys,
  jobTitle: string
}

export type Businesses = {
  [key: string]: BusinessRelationship
}

