import { typedKeys } from "../utils";

export const CheckoutStatus = {
  Pending: 'Pending',
  Paid: 'Paid',
  Cancelled: 'Cancelled',
  PartiallyPaid: 'Partially Paid',
  Refunded: 'Refunded',
} as const

export const splitTypes = {
  Equally: "Equally",
  ByPatron: "By Patron",
  Custom: "Custom",
} as const;


export type SplitType = keyof typeof splitTypes;
export const splitType = ['ByPatron', 'Equally', 'Custom'] as const

export type CheckoutStatusKeys = keyof typeof CheckoutStatus
