import { Types, SchemaTypes, Schema, SchemaDefinition, Connection } from 'mongoose'
import { Menu } from './menu';
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Address } from './address';
import { Product } from './product';
import { Category } from './category';
import { User } from './user';
// import type { HousOfOperationType } from 'app-helpers';
export class Business {
    @prop({ required: true })
    public user!: Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public email!: string;

    @prop()
    public phone?: string;

    @prop()
    public website?: string;

    @prop({ ref: Address })
    public address?: Ref<Address>;

    // @prop()
    // public hoursOfOperation?: HousOfOperationType;

    @prop({ ref: () => Product, default: [] })
    public products!: Ref<Product>[];

    @prop({
        ref: Category,
        default: [],
        foreignField: 'business',
        localField: '_id',
    })
    public categories!: Ref<Category>[];

    @prop({ ref: () => Menu })
    public menus!: Ref<Menu>[];

    @prop({ default: [] })
    public employees?: Ref<User>[];

    @prop({ default: Date.now() })
    public created_date!: Date;
}

export const BusinessModel = (conn: Connection) =>
    getModelForClass(Business, {
        existingConnection: conn,
        schemaOptions: { collection: 'Business' }
    });
