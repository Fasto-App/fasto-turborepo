import { CLIENT } from "./appRoute";

export const clientRoute = {
  home: (businessId: string) => `${CLIENT}/${businessId}`,
  cart: (businessId: string) => `${CLIENT}/${businessId}/cart/`,
  menu: (businessId: string) => `${CLIENT}/${businessId}/menu`,
  checkout: (businessId: string, checkoutId: string) => `${CLIENT}/${businessId}/checkout/${checkoutId}`,
  production_description: (businessId: string, productId: string) => `${CLIENT}/${businessId}/product-description/${productId}`,
  settings: (businessId: string) => `${CLIENT}/${businessId}/settings`,
} as const

export type ClientRouteKeys = keyof typeof clientRoute;

export const clientPathName = {
  [`/client/[businessId]`]: 'Home',
  [`/client/[businessId]/cart/[cartId]`]: 'Cart',
  [`/client/[businessId]/menu`]: 'Menu',
  [`/client/[businessId]/checkout/[checkoutId]`]: 'Checkout',
  [`/client/[businessId]/product-description/[productId]`]: 'Product Description',
  [`/client/[businessId]/settings`]: 'Settings',
} as const

export type PathNameKeys = keyof typeof clientPathName;