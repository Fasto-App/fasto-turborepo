import { Connection, Types } from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { User } from './user';
import { Table } from './table';
import { OrderDetail } from './orderDetail';
import { TabStatus } from 'app-helpers';
import type { TabStatusType, TabTypeType } from 'app-helpers';
import { CartItem } from './cartItem';

export class Tab {
    @prop()
    public checkout?: Types.ObjectId;

    @prop({ required: true })
    public admin!: Ref<User>;

    @prop({ default: TabStatus.Open })
    public status?: TabStatusType;

    @prop()
    public table?: Ref<Table>;

    @prop()
    public type?: TabTypeType;


    @prop({ required: true, default: [] })
    public cartItems!: Ref<CartItem>[];

    @prop({ required: true, default: [] })
    public orders!: Ref<OrderDetail>[];

    @prop({ required: true })
    public users!: Ref<User>[];

    @prop({ default: Date.now() })
    public created_date!: Date;

    @prop()
    public completed_at?: Date;
}

export const TabModel = (conn: Connection) =>
    getModelForClass(Tab, {
        existingConnection: conn,
        schemaOptions: { collection: 'Tab' }
    })