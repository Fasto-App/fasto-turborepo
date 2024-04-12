import { Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { AppNavigation } from 'fasto-route';
import { Business } from './business';
import type { Ref } from '@typegoose/typegoose';
import { User } from './user';

export class Notification {
  @prop({ required: true })
  public message!: string;

  @prop()
  public path?: AppNavigation;

  @prop({ required: true, default: false })
  public isRead!: boolean;

  @prop({ ref: () => Business })
  public business_receiver_id!: Ref<Business>;

  @prop({ ref: () => User })
  public customer_receiver_id!: Ref<User>;

  @prop({ ref: () => User, required: true })
  public sender_id!: Ref<User>;

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const NotificationModel = (conn: Connection) =>
  getModelForClass(Notification, {
    existingConnection: conn,
    schemaOptions: { collection: 'Notification' }
  });
