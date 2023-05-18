import { CUSTOMER } from "./appRoute";
import i18next from 'i18next'


export const customerRoute = {
  home: (businessId: string) => `${CUSTOMER}/${businessId}`,
  cart: (businessId: string) => `${CUSTOMER}/${businessId}/cart/`,
  menu: (businessId: string) => `${CUSTOMER}/${businessId}/menu`,
  checkout: (businessId: string, checkoutId: string) => `${CUSTOMER}/${businessId}/checkout/${checkoutId}`,
  split: (businessId: string, checkoutId: string) => `${CUSTOMER}/${businessId}/split/${checkoutId}`,
  production_description: (businessId: string, productId: string) => `${CUSTOMER}/${businessId}/product-description/${productId}`,
  settings: (businessId: string) => `${CUSTOMER}/${businessId}/settings`,
} as const

export type customerRouteKeys = keyof typeof customerRoute;

export const customerPathName = {
  [`/customer/[businessId]`]: "home",
  [`/customer/[businessId]/cart`]: 'cart',
  [`/customer/[businessId]/menu`]: 'menu',
  [`/customer/[businessId]/checkout/[checkoutId]`]: 'checkout',
  [`/customer/[businessId]/split/[checkoutId]`]: 'split',
  [`/customer/[businessId]/product-description/[productId]`]: 'productDescription',
  [`/customer/[businessId]/settings`]: 'settings',
} as const

export const customerTitlePath = {
  Home: `/customer/[businessId]`,
  Cart: `/customer/[businessId]/cart`,
  Menu: `/customer/[businessId]/menu`,
  Checkout: `/customer/[businessId]/checkout/[checkoutId]`,
  Split: `/customer/[businessId]/split/[checkoutId]`,
  'Product Description': `/customer/[businessId]/product-description/[productId]`,
  Settings: `/customer/[businessId]/settings`,
} as const;

export const customerRouteParams = {
  tabId: 'tabId',
  businessId: 'businessId',
  checkoutId: 'checkoutId',
  productId: 'productId',
  adminId: 'adminId',
  name: 'name',
}

export type PathNameKeys = keyof typeof customerPathName;
export type customerTitlePathKeys = keyof typeof customerTitlePath;

export const customerPathNameKeys = Object.keys(customerPathName) as PathNameKeys[];
export const customerTitlePathKeys = Object.keys(customerTitlePath) as customerTitlePathKeys[];
