import { Connection, Types } from "mongoose"
import { prop, getModelForClass, } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Category } from "./category";
import { Product } from "./product";
import { Business } from "./business";


export class Section {
    @prop({ ref: () => Category, required: true })
    public category!: Ref<Category>;

    @prop({ ref: () => Product, default: [] })
    public products?: Ref<Product>[];
}

export class Menu {
    @prop({ required: true })
    public name!: string;

    @prop({ default: [], type: () => Section })
    public sections?: Section[];

    @prop({ ref: () => Business })
    public business!: Types.ObjectId;;

    @prop({ default: Date.now() })
    public created_date!: Date;
}



export const MenuModel = (conn: Connection) =>
    getModelForClass(Menu, { existingConnection: conn, schemaOptions: { collection: 'Menu' } })
