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
  [`/client/[businessId]/cart`]: 'Cart',
  [`/client/[businessId]/menu`]: 'Menu',
  [`/client/[businessId]/checkout/[checkoutId]`]: 'Checkout',
  [`/client/[businessId]/product-description/[productId]`]: 'Product Description',
  [`/client/[businessId]/settings`]: 'Settings',
} as const

export const clientTitlePath = {
  Home: `/client/[businessId]`,
  Cart: `/client/[businessId]/cart`,
  Menu: `/client/[businessId]/menu`,
  Checkout: `/client/[businessId]/checkout/[checkoutId]`,
  'Product Description': `/client/[businessId]/product-description/[productId]`,
  Settings: `/client/[businessId]/settings`,
} as const;

export type PathNameKeys = keyof typeof clientPathName;
export type ClientTitlePathKeys = keyof typeof clientTitlePath;

export const clientPathNameKeys = Object.keys(clientPathName) as PathNameKeys[];
export const clientTitlePathKeys = Object.keys(clientTitlePath) as ClientTitlePathKeys[];
