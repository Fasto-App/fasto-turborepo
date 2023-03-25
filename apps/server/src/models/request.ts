import { Types, Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { RequestStatus } from 'app-helpers';

export class Request {
  @prop()
  public business?: Types.ObjectId;

  @prop()
  public admin?: Types.ObjectId;

  @prop({ required: true })
  public requestor!: Types.ObjectId;

  @prop()
  public tab?: Types.ObjectId;

  @prop()
  public totalGuests?: number;

  @prop()
  public names?: string[];

  @prop({ default: "Pending" })
  public status?: RequestStatus;

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const RequestModel = (conn: Connection) =>
  getModelForClass(Request, {
    existingConnection: conn,
    schemaOptions: { collection: 'Request' }
  });
