import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { CheckoutStatusKeys, SplitType } from 'app-helpers';

export class Checkout {
  @prop({ required: true })
  public business!: Types.ObjectId;

  @prop({ required: true })
  public tab!: Types.ObjectId;

  @prop({ required: true, default: "Pending" })
  public status!: CheckoutStatusKeys;

  @prop()
  public splitType?: SplitType;

  @prop({ required: true, default: false })
  public paid!: boolean;

  @prop({ default: [] })
  public orders?: Types.ObjectId[];

  @prop({ default: [] })
  public payments?: Types.ObjectId[];

  @prop({ default: 0 })
  public subTotal!: number;

  @prop()
  public tip?: number;

  @prop()
  public discount?: number;

  @prop({ default: 0 })
  public tax?: number;

  @prop({ required: true, default: 0 })
  public total!: number;

  @prop({ required: true, default: 0 })
  public totalPaid!: number;

  @prop({ default: Date.now() })
  public created_date!: Date;
};

export const CheckoutModel = (conn: Connection) =>
  getModelForClass(Checkout, { existingConnection: conn, schemaOptions: { collection: 'Checkout' } });