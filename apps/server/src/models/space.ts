import { Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Business } from './business';

export class Space {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public business!: Ref<Business>;

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const SpaceModel = (conn: Connection) =>
  getModelForClass(Space, { existingConnection: conn, schemaOptions: { collection: 'Space' } });