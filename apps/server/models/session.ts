import mongoose, { Document, Connection, Types } from 'mongoose'
import { prop, getModelForClass, pre, Ref } from '@typegoose/typegoose';


@pre<Session>('update', function () {

})
export class Session {

  @prop()
  public email?: string;

  @prop()
  public token?: string;

  @prop({ default: Date.now() })
  public createdAt!: Date
}
// TODO: store Session last valid token

export const SessionModel = (conn: Connection) => getModelForClass(Session, { existingConnection: conn, schemaOptions: { collection: 'Session' } });
export type ISessionModel = typeof SessionModel & Document & Session;