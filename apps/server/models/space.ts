import { Connection } from 'mongoose'
import { prop, getModelForClass, Ref, pre } from '@typegoose/typegoose';
import { Business } from './business';

@pre<Space>('deleteOne', function () {
  console.log("DECORATOR SPACE")
})

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