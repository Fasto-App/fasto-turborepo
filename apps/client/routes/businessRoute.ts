import { BUSINESS_ADMIN, BUSINESS } from "./appRoute";

export const businessRoute = {
  add_products_categories: `${BUSINESS_ADMIN}/add-products-categories`,
  add_to_order: `${BUSINESS_ADMIN}/add-to-order`,
  checkout: `${BUSINESS_ADMIN}/checkout/[checkoutId]`,
  createAccount: `${BUSINESS}/create-account`,
  dashboard: `${BUSINESS_ADMIN}/dashboard`,
  forgotPassword: `${BUSINESS}/forgot-password`,
  settings: `${BUSINESS_ADMIN}/settings`,
  help: `${BUSINESS_ADMIN}/help`,
  login: `${BUSINESS}/login`,
  menu: `${BUSINESS_ADMIN}/menu`,
  orders: `${BUSINESS_ADMIN}/orders`,
  signup: `${BUSINESS}/signup`,
  tables: `${BUSINESS_ADMIN}/tables`,
  resetPassword: `${BUSINESS}/reset-password`,
} as const;