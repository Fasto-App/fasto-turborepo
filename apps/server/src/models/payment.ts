import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { CheckoutStatusKeys, SplitType } from 'app-helpers';

export class Payment {
  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public tip!: number;

  @prop()
  public patron?: Types.ObjectId;

  @prop()
  public paymentMethod?: string;

  @prop()
  public splitType?: SplitType;

  @prop({ default: Date.now() })
  public created_date!: Date;
};

export const PaymentModel = (conn: Connection) =>
  getModelForClass(Payment, { existingConnection: conn, schemaOptions: { collection: 'Payment' } });