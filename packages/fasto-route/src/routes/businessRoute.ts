export const ADMIN = "/admin" as const
export const BUSINESS = "/business" as const
export const BUSINESS_ADMIN = `${BUSINESS}${ADMIN}` as const

const addProductsCategories = "add-products-categories";
const addToOrder = "add-to-order";
const checkout = "checkout/[checkoutId]";
const createAccount = "create-account";
const dashboard = "dashboard";
const forgotPassword = "forgot-password";
const settings = "settings";
const help = "help";
const login = "login";
const menu = "menu";
const orders = "orders";
const signup = "signup";
const tables = "tables";
const resetPassword = "reset-password";
const payments = "payments";
const subscriptions = "subscriptions"

export const businessRoute = {
  [addProductsCategories]: `${BUSINESS_ADMIN}/${addProductsCategories}`,
  [addToOrder]: `${BUSINESS_ADMIN}/${addToOrder}`,
  [checkout]: `${BUSINESS_ADMIN}/${checkout}`,
  [createAccount]: `${BUSINESS}/${createAccount}`,
  [dashboard]: `${BUSINESS_ADMIN}/${dashboard}`,
  [forgotPassword]: `${BUSINESS}/${forgotPassword}`,
  [settings]: `${BUSINESS_ADMIN}/${settings}`,
  [help]: `${BUSINESS_ADMIN}/${help}`,
  [login]: `${BUSINESS}/${login}`,
  [menu]: `${BUSINESS_ADMIN}/${menu}`,
  [orders]: `${BUSINESS_ADMIN}/${orders}`,
  [signup]: `${BUSINESS}/${signup}`,
  [tables]: `${BUSINESS_ADMIN}/${tables}`,
  [resetPassword]: `${BUSINESS}/${resetPassword}`,
  [payments]: `${BUSINESS_ADMIN}/${payments}`,
  [subscriptions]: `${BUSINESS_ADMIN}/${subscriptions}`
} as const;

export const businessPathName = {
  [`${BUSINESS}/${payments}`]: 'payments',
  [`${BUSINESS}/${login}`]: 'login',
  [`${BUSINESS}/${createAccount}`]: 'createAccount',
  [`${BUSINESS}/${forgotPassword}`]: 'forgotPassword',
  [`${BUSINESS}/${signup}`]: 'signup',
  [`${BUSINESS}/${resetPassword}`]: 'resetPassword',
  [`${BUSINESS_ADMIN}/${settings}`]: 'businessSettings',
  [`${BUSINESS_ADMIN}/${addProductsCategories}`]: 'productsCategories',
  [`${BUSINESS_ADMIN}/${addToOrder}`]: 'addToOrder',
  [`${BUSINESS_ADMIN}/${checkout}`]: 'businessCheckout',
  [`${BUSINESS_ADMIN}/${dashboard}`]: 'dashboard',
  [`${BUSINESS_ADMIN}/${help}`]: 'help',
  [`${BUSINESS_ADMIN}/${menu}`]: 'menus',
  [`${BUSINESS_ADMIN}/${orders}`]: 'orders',
  [`${BUSINESS_ADMIN}/${tables}`]: 'tables',
} as const;

export type BusinessRouteKeys = keyof typeof businessPathName;
