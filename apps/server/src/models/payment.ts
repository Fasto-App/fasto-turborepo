import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { SplitType } from 'app-helpers';

export class Payment {
  @prop({ required: true })
  public amount!: number;

  @prop()
  public tip!: number;

  @prop({ default: 0 })
  public discount?: number;

  @prop({ required: true })
  public patron!: Types.ObjectId;

  @prop()
  public paymentMethod?: string;

  @prop()
  public splitType?: SplitType;

  @prop({ default: Date.now() })
  public created_date!: Date;
};

export const PaymentModel = (conn: Connection) =>
  getModelForClass(Payment, { existingConnection: conn, schemaOptions: { collection: 'Payment' } });