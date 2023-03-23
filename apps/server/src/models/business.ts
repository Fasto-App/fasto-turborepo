import { Types, Connection } from 'mongoose'
import { Menu } from './menu';
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Address } from './address';
import { Product } from './product';
import { Category } from './category';
import { User } from './user';
import { Session } from './session';
import type { HoursOfOperationType } from 'app-helpers';
export class Business {
    @prop({ required: true })
    public user!: Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop()
    public description?: string;

    @prop()
    public picture?: string;

    @prop({ required: true })
    public email!: string;

    @prop()
    public phone?: string;

    @prop()
    public website?: string;

    @prop({ ref: Address })
    public address?: Ref<Address>;

    //TODO: How are we representing this?
    @prop()
    public hoursOfOperation?: HoursOfOperationType;

    @prop({ ref: () => Product, default: [] })
    public products!: Ref<Product>[];

    // FIX: Next time add documentation if you dont understand what this is
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

    @prop({ default: [] })
    public employeesPending?: Ref<Session>[];

    @prop({ default: 0 })
    public taxRate?: number;

    @prop({ default: Date.now() })
    public created_date!: Date;
}

export const BusinessModel = (conn: Connection) =>
    getModelForClass(Business, {
        existingConnection: conn,
        schemaOptions: { collection: 'Business' }
    });
