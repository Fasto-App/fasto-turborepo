import { Document, Connection } from 'mongoose'
import { prop, getModelForClass, pre } from '@typegoose/typegoose';
@pre<GuestUser>('deleteOne', function () {
  console.log("Delete user", this);
})

export class GuestUser {
  @prop()
  public name?: string;

  @prop()
  public email?: string;

  @prop({ default: Date.now() })
  public createdAt!: Date
}
// TODO: store user last valid token

export const GuestUserModel = (conn: Connection) => getModelForClass(GuestUser, { existingConnection: conn, schemaOptions: { collection: 'GuestUser' } });