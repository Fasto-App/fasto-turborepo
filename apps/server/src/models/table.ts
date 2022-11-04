import { Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Space } from './space';
import { TableStatus } from './types';

export class Table {
  @prop({ required: true })
  public space!: Ref<Space>;

  @prop({ required: true })
  public tableNumber!: string;

  @prop({ required: true, default: TableStatus.AVAILABLE })
  public status!: TableStatus;

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const TableModel = (conn: Connection) =>
  getModelForClass(Table, { existingConnection: conn, schemaOptions: { collection: 'Table' } });