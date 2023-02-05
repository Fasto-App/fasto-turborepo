import { Connection } from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { User } from './user';
import { Table } from './table';
import { OrderDetail } from './orderDetail';
import { TabStatus } from './types';
import type { TabStatusType } from './types';


export class Tab {
    @prop({ required: true })
    public admin!: Ref<User>;

    @prop({ default: TabStatus.OPEN })
    public status!: TabStatusType;

    @prop({ required: true })
    public table!: Ref<Table>;

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