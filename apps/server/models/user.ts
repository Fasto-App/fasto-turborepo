import { Document, Connection } from 'mongoose'
import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import { Privileges } from './types';


export class User {
    @prop({ unique: false, required: true })
    public name!: string;

    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop()
    public businesses?: Record<string, Privileges[]>;

    @prop({ default: Date.now() })
    public createdAt!: Date
}
// TODO: store user last valid token

export const UserModel = (conn: Connection) => getModelForClass(User, { existingConnection: conn, schemaOptions: { collection: 'User' } });
export type IUserModel = typeof UserModel & Document & User;