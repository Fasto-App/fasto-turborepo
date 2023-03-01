export const CheckoutStatus = {
  Pending: 'Pending',
  Paid: 'Paid',
  Cancelled: 'Cancelled',
  PartiallyPaid: 'Partially Paid',
  Refunded: 'Refunded',
} as const

export type CheckoutStatusKeys = keyof typeof CheckoutStatus
