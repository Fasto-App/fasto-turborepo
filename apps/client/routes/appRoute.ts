import { businessRoute } from "."
import { clientRoute } from "./clientRoute"

export const HOME = "/" as const
const ADMIN = "/admin" as const
export const BUSINESS = "/business" as const
export const CLIENT = "/client" as const
export const BUSINESS_ADMIN = BUSINESS + ADMIN

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