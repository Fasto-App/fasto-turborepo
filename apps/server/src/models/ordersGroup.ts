import { Connection } from "mongoose"
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Tab } from "./tab";
import { OrderStatus } from "app-helpers";
import type { OrderStatusType, TabTypeType } from "app-helpers";
import { OrderDetail } from "./orderDetail";
import { Business } from "./business";
import { User } from "./user";
export class OrdersGroup {
  @prop({ required: true })
  public orders!: Ref<OrderDetail>[];

  @prop()
  public business!: Ref<Business>;

  @prop({ required: true })
  public createdByUser!: Ref<User>;

  @prop({ required: true, ref: () => Tab })
  public tab!: Ref<Tab>;

  @prop({ required: true })
  public type!: TabTypeType;

  @prop({ required: true, default: OrderStatus.Open })
  public status!: OrderStatusType;

  @prop()
  public message?: string;

  @prop({ default: Date.now() })
  public created_date!: Date;

  @prop({ default: Date.now() })
  public updated_date!: Date;
}

export const OrdersGroupModel = (conn: Connection) =>
  getModelForClass(OrdersGroup, { existingConnection: conn, schemaOptions: { collection: 'OrdersGroup' } })
