import { CLIENT } from "./appRoute";

export const clientRoute = {
  cart: `${CLIENT}/123/cart/123`,
  menu: (businessId: string) => `${CLIENT}/${businessId}/menu`,
  checkout: `${CLIENT}/123/checkout/123`,
  production_description: (productId: string) => `${CLIENT}/123/product-description/${productId}`,
  settings: `${CLIENT}/123/settings`,
} as const

export const clientPathName = {
  [`/client/[businessId]/cart/[cartId]`]: 'Cart',
  [`/client/[businessId]/menu`]: 'Menu',
  [`/client/[businessId]/checkout/[checkoutId]`]: 'Checkout',
  [`/client/[businessId]/product-description/[productId]`]: 'Product Description',
  [`/client/[businessId]/settings`]: 'Settings',
} as const

export type PathNameKeys = keyof typeof clientPathName;