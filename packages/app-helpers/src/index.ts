export const Privileges = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SERVER: 'SERVER',
  COOK: 'COOK',
  BARTENDER: 'BARTENDER',
  BUSSER: 'BUSSER'
} as const;

export type PrivilegesType = typeof Privileges[keyof typeof Privileges];

export const TableStatus = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  RESERVED: 'RESERVED',
  CLOSED: 'CLOSED'
} as const;

export type TableStatusType = typeof TableStatus[keyof typeof TableStatus];

export const OrderStatus = {
  OPEN: 'OPEN',
  PENDENT: 'PENDENT',
  DELIVERED: 'DELIVERED',
  CLOSED: 'CLOSED'
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const TabStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
} as const

export type TabStatusType = typeof TabStatus[keyof typeof TabStatus];

export * from "./businessTypes"

