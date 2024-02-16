import { Connection, Types } from 'mongoose'
import { prop, getModelForClass, Severity, modelOptions, } from '@typegoose/typegoose';
import { getPercentageOfValue, type CheckoutStatusKeys, type SplitType } from 'app-helpers';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
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

  public get tipValue() {
    return getPercentageOfValue(this.total, this.tip ?? 0);
  }

  @prop()
  public discount?: number;

  @prop({ default: 0 })
  public tax?: number;

  public get taxValue() {
    return getPercentageOfValue(this.total, this.tax ?? 0);
  }

  @prop({ required: true, default: 0 })
  public total!: number;

  @prop({ required: true, default: 0 })
  public totalPaid!: number;

  @prop({ default: 201 })
  public serviceFee?: number;

  public get serviceFeeValue() {
    return getPercentageOfValue(this.total, this.serviceFee ?? 0);
  }

  @prop({ default: Date.now() })
  public created_date!: Date;

  @prop({ required: true, default: Date.now() })
  public updated_at!: Date;
};

export const CheckoutModel = (conn: Connection) =>
  getModelForClass(Checkout, { existingConnection: conn, schemaOptions: { collection: 'Checkout' } });