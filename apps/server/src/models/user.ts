import { Document, Connection } from 'mongoose'
import { prop, getModelForClass, Severity, modelOptions } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import type { Businesses } from 'app-helpers';
import { Address } from './address';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
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

    @prop({ default: true })
    public isGuest!: boolean;

    @prop()
    public stripeCustomer?: string;

    @prop({ ref: Address })
    public address?: Ref<Address>;

    @prop({ default: Date.now() })
    public createdAt!: Date
}
// TODO: store user last valid token

export const UserModel = (conn: Connection) => getModelForClass(User, { existingConnection: conn, schemaOptions: { collection: 'User' } });
export type IUserModel = typeof UserModel & Document & User;