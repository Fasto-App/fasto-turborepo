import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { CheckoutStatusKeys } from 'app-helpers';

export class Checkout {
  @prop({ required: true, default: "Pending" })
  public status!: CheckoutStatusKeys;

  @prop({ required: true, default: false })
  public paid!: boolean;

  @prop({ default: [] })
  public orders?: Types.ObjectId[];

  @prop({ default: [] })
  public payments?: Types.ObjectId[];

  @prop()
  public subTotal?: number;

  @prop()
  public tip?: number;

  @prop()
  public tax?: number;

  @prop()
  public total?: number;

  @prop({ required: true, default: 0 })
  public totalPaid!: number;

  @prop({ default: Date.now() })
  public created_date!: Date;
};

export const CheckoutModel = (conn: Connection) =>
  getModelForClass(Checkout, { existingConnection: conn, schemaOptions: { collection: 'Checkout' } });