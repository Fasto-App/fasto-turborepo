import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { CheckoutStatusKeys } from 'app-helpers';

export class Payment {
  @prop({ required: true })
  public amount!: number;

  @prop()
  public patron?: Types.ObjectId;

  @prop()
  public paymentMethod?: string;

  @prop({ default: Date.now() })
  public created_date!: Date;
};

export const CheckoutModel = (conn: Connection) =>
  getModelForClass(Payment, { existingConnection: conn, schemaOptions: { collection: 'Payment' } });