import { Connection, Types } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';

export class CartItem {
    @prop({ required: true })
    public product!: Types.ObjectId;

    @prop({ required: true })
    public user?: Types.ObjectId;

    @prop({ required: true, default: 1 })
    public quantity!: number;

    @prop({ required: true, default: 0 })
    public subTotal!: number;

    @prop({ default: Date.now() })
    public created_date!: Date;
};

export const CartItemModel = (conn: Connection) =>
    getModelForClass(CartItem, { existingConnection: conn, schemaOptions: { collection: 'CartItem' } });