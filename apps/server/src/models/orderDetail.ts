import { Types, Connection } from "mongoose"
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Tab } from "./tab";
import { OrderStatus } from "./types";
import type { OrderStatusType } from "./types";
export class OrderDetail {
    @prop({ required: true })
    public product!: Types.ObjectId;

    @prop()
    public user?: Types.ObjectId;

    @prop({ required: true, ref: () => Tab })
    public tab!: Ref<Tab>;

    @prop({ required: true, default: 1 })
    public quantity!: number;

    @prop({ required: true, default: 0 })
    public subTotal!: number;

    @prop({ required: true, default: OrderStatus.PENDENT })
    public status!: OrderStatusType;

    @prop()
    public message?: string;

    @prop({ default: Date.now() })
    public created_date!: Date;

    @prop({ default: Date.now() })
    public updated_date!: Date;
}

export const OrderDetailModel = (conn: Connection) =>
    getModelForClass(OrderDetail, { existingConnection: conn, schemaOptions: { collection: 'OrderDetail' } })
