import { Schema, model, SchemaDefinition, SchemaTypes, Connection } from 'mongoose'
import { prop, getModelForClass, Ref, pre } from '@typegoose/typegoose';

export class Address {
    @prop({ required: true })
    public city!: string;

    @prop({ required: true })
    public zipcode!: string;

    @prop({ required: true })
    public streetName!: string;

    @prop({ required: true })
    public streetNumber!: string;


    @prop({ default: Date.now() })
    public created_date!: Date;
}

export const AddressModel = (conn: Connection) =>
    getModelForClass(Address, { existingConnection: conn, schemaOptions: { collection: 'Address' } });