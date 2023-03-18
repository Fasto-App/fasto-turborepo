import { CLIENT } from "./appRoute";

export const clientRoute = {
  home: (businessId: string) => `${CLIENT}/${businessId}`,
  cart: (businessId: string) => `${CLIENT}/${businessId}/cart/123`,
  menu: (businessId: string) => `${CLIENT}/${businessId}/menu`,
  checkout: (businessId: string) => `${CLIENT}/${businessId}/checkout/123`,
  production_description: (productId: string) => `${CLIENT}/123/product-description/${productId}`,
  settings: (businessId: string) => `${CLIENT}/${businessId}/settings`,
} as const

export const clientPathName = {
  [`/client/[businessId]`]: 'Home',
  [`/client/[businessId]/cart/[cartId]`]: 'Cart',
  [`/client/[businessId]/menu`]: 'Menu',
  [`/client/[businessId]/checkout/[checkoutId]`]: 'Checkout',
  [`/client/[businessId]/product-description/[productId]`]: 'Product Description',
  [`/client/[businessId]/settings`]: 'Settings',
} as const

export type PathNameKeys = keyof typeof clientPathName;