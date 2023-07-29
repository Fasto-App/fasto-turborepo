import { appRoute, } from './routes/appRoute';
import { businessRoute, BUSINESS_ADMIN, businessPathName, BUSINESS } from "./routes/businessRoute"
import { CUSTOMER, customerRoute, customerRouteParams, PathNameKeys, customerPathName, customerRouteKeys } from "./routes/customerRoute"

import type { AppNavigation } from './routes/appRoute';
import type { BusinessRouteKeys } from "./routes/businessRoute"

export {
  appRoute,
  businessRoute,
  BUSINESS_ADMIN,
  BUSINESS,
  CUSTOMER,
  businessPathName,
  customerRoute,
  customerRouteParams,
  customerPathName,
}

export type {
  AppNavigation,
  BusinessRouteKeys,
  PathNameKeys,
  customerRouteKeys
}