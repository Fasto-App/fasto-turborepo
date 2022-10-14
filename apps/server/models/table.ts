import { Connection } from 'mongoose'
import { prop, getModelForClass, Ref, pre } from '@typegoose/typegoose';
import { Space } from './space';
import { TableStatus } from './types';

@pre<Table>('save', function () {
  console.log("DECORATOR Table Save")
})

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