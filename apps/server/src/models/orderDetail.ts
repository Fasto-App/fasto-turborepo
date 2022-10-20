import { Schema, SchemaDefinition, SchemaType, Types, Connection } from "mongoose"
import { prop, getModelForClass, Ref, post } from '@typegoose/typegoose';
import { OrderStatus } from "./types";
import { Tab } from "./tab";

export class OrderDetail {
    @prop({ required: true })
    public product!: Types.ObjectId;

    @prop({ required: true })
    public user!: Types.ObjectId;

    @prop({ required: true, ref: () => Tab })
    public tab!: Ref<Tab>;

    @prop({ required: true, default: 1 })
    public quantity!: number;

    @prop({ required: true, default: 0 })
    public subTotal!: number;

    @prop({ required: true, default: OrderStatus.PENDENT })
    public status!: OrderStatus;

    @prop()
    public message?: string;

    @prop({ default: Date.now() })
    public created_date!: Date;

    @prop({ default: Date.now() })
    public updated_date!: Date;
}

export const OrderDetailModel = (conn: Connection) =>
    getModelForClass(OrderDetail, { existingConnection: conn, schemaOptions: { collection: 'OrderDetail' } })
