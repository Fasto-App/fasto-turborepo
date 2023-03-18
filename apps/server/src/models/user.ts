import { Document, Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Businesses } from 'app-helpers';

export class User {
    @prop({ unique: false })
    public name?: string;

    @prop()
    public email?: string;

    @prop({ required: false })
    public password?: string;

    @prop()
    public businesses?: Businesses;

    @prop()
    public JobTitles?: string[];

    @prop()
    public phoneNumber?: string;

    @prop()
    public picture?: string;

    @prop({ default: false })
    public isGuest!: boolean;

    @prop({ default: Date.now() })
    public createdAt!: Date
}
// TODO: store user last valid token

export const UserModel = (conn: Connection) => getModelForClass(User, { existingConnection: conn, schemaOptions: { collection: 'User' } });
export type IUserModel = typeof UserModel & Document & User;