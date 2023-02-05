import { Document, Connection } from 'mongoose'
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { PrivilegesType } from "./types";
export class User {
    @prop({ unique: false, required: true })
    public name!: string;

    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop()
    public businesses?: Record<string, PrivilegesType[]>;

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