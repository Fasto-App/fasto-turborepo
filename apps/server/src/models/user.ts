import { Document, Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import { PrivilegesKeys } from 'app-helpers';
import type { Businesses } from './types';

export class User {
    @prop({ unique: false, required: true })
    public name!: string;

    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop()
    public businesses?: Businesses;

    @prop()
    public JobTitles?: string[];

    @prop()
    public phone?: string;

    @prop()
    public picture?: string;

    @prop({ default: Date.now() })
    public createdAt!: Date
}
// TODO: store user last valid token

export const UserModel = (conn: Connection) => getModelForClass(User, { existingConnection: conn, schemaOptions: { collection: 'User' } });
export type IUserModel = typeof UserModel & Document & User;