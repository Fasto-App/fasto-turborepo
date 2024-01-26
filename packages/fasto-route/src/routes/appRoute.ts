import { businessRoute, BUSINESS } from "./businessRoute";
import { customerRoute, CUSTOMER } from "./customerRoute";

export const HOME = "/" as const;

export const appRoute = {
	home: HOME,
	businessRoute,
	customerRoute,
};

type HomeRoute = typeof HOME;

type Client = typeof customerRoute;
type ClientKeys = keyof Client;
type customerRoutes = Client[ClientKeys];

type Business = typeof businessRoute;
type BusinessKeys = keyof Business;
type BusinessRoutes = Business[BusinessKeys];
export type AppNavigation = HomeRoute | BusinessRoutes | customerRoutes;

type BusinessExperience = typeof BUSINESS;
type ClientExperience = typeof CUSTOMER;
export type AppExperience = BusinessExperience | ClientExperience;
