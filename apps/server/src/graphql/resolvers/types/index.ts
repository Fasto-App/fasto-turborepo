import { Connection } from "mongoose"

export interface UserContext {
  _id: string;
  email: string;
  business?: string;
}

export interface Context {
  db: Connection
  user?: UserContext
  business?: string
}

