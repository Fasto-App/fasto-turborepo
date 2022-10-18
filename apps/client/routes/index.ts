const HOME = "/" as const
const ADMIN = "/admin" as const
export const BUSINESS = "/business" as const
export const CLIENT = "/client" as const
export const BUSINESS_ADMIN = BUSINESS + ADMIN

export const businessRoute = {
  add_products_categories: `${BUSINESS_ADMIN}/add-products-categories`,
  add_to_order: (orderId: string) => `${BUSINESS_ADMIN}/add-to-order/${orderId}`,
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

export const clientRoute = {
  cart: `${CLIENT}/settings`,
  menu: `${CLIENT}/menu`,
  checkout: `${CLIENT}/checkout`,
  production_description: `${CLIENT}/production_description`,
  settings: `${CLIENT}/settings`,
} as const


export const appRoute = {
  home: HOME,
  businessRoute,
  clientRoute
};

type HomeRoute = typeof HOME;

type Client = typeof clientRoute
type ClientKeys = keyof Client;
type ClientRoutes = Client[ClientKeys];


type Business = typeof businessRoute;
type BusinessKeys = keyof Business;
type BusinessRoutes = Business[BusinessKeys];
export type AppNavigation = HomeRoute | BusinessRoutes | ClientRoutes;

type BusinessExperience = typeof BUSINESS
type ClientExperience = typeof CLIENT;
export type AppExperience = BusinessExperience | ClientExperience;