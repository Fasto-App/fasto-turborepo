import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { PaymentOption, SplitType } from 'app-helpers';

export class Payment {
  @prop({ required: true })
  public checkout!: Types.ObjectId;

  @prop({ required: true })
  public amount!: number;

  @prop()
  public tip!: number;

  @prop({ required: true })
  public patron!: Types.ObjectId;

  @prop()
  public paymentMethod?: PaymentOption;

  @prop({ required: true })
  public splitType!: SplitType;

  @prop({ required: true, default: false })
  public paid!: boolean;

  @prop({ default: Date.now() })
  public created_date!: Date;
};

export const PaymentModel = (conn: Connection) =>
  getModelForClass(Payment, { existingConnection: conn, schemaOptions: { collection: 'Payment' } });