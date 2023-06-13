import { CUSTOMER } from "./appRoute";

const businessId = "[businessId]" as const;

const home = `${CUSTOMER}/${businessId}` as const;
const cart = `${CUSTOMER}/${businessId}/cart` as const;
const menu = `${CUSTOMER}/${businessId}/menu` as const;
const checkout = `${CUSTOMER}/${businessId}/checkout/[checkoutId]` as const;
const split = `${CUSTOMER}/${businessId}/split/[checkoutId]` as const;
const productDescription = `${CUSTOMER}/${businessId}/product-description/[productId]` as const;
const settings = `${CUSTOMER}/${businessId}/settings` as const;

export const customerRoute = {
  [home]: home,
  [cart]: cart,
  [menu]: menu,
  [checkout]: checkout,
  [split]: split,
  [productDescription]: productDescription,
  [settings]: settings,
} as const;

export type customerRouteKeys = keyof typeof customerRoute;

export const customerPathName = {
  [home]: "home",
  [cart]: 'cart',
  [menu]: 'menu',
  [checkout]: 'checkout',
  [split]: 'split',
  [productDescription]: 'productDescription',
  [settings]: 'settings',
} as const

export const customerRouteParams = {
  tabId: 'tabId',
  businessId: 'businessId',
  checkoutId: 'checkoutId',
  productId: 'productId',
  adminId: 'adminId',
  name: 'name',
}

export type PathNameKeys = keyof typeof customerPathName;

export const customerPathNameKeys = Object.keys(customerPathName) as PathNameKeys[];
