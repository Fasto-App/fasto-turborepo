import { Document, Connection } from 'mongoose'
import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import { PrivilegesKeys } from 'app-helpers';

export class Session {
  @prop()
  public email?: string;

  @prop()
  public name?: string;

  @prop()
  public token?: string;

  @prop()
  public businesses?: Record<string, PrivilegesKeys[]>;

  @prop({ default: Date.now() })
  public createdAt!: Date
}
// TODO: store Session last valid token

export const SessionModel = (conn: Connection) => getModelForClass(Session, { existingConnection: conn, schemaOptions: { collection: 'Session' } });
export type ISessionModel = typeof SessionModel & Document & Session;