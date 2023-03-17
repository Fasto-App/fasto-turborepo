import { Types, Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';

export class Request {
  @prop({ required: true })
  public admin!: Types.ObjectId;

  @prop({ required: true })
  public totalGuests!: number;

  @prop()
  public names?: string[];

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const RequestModel = (conn: Connection) =>
  getModelForClass(Request, {
    existingConnection: conn,
    schemaOptions: { collection: 'Request' }
  });
