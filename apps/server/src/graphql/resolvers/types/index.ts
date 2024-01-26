import { Locale } from "app-helpers";
import { Connection } from "mongoose";

export interface UserContext {
	_id: string;
	email: string;
	business?: string;
}

export interface ClientContext {
	_id: string;
	business: string;
	request: string;
}

export interface Context {
	db: Connection;
	user?: UserContext;
	client?: ClientContext;
	business?: string;
	locale: Locale;
}
