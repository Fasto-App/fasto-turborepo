import { Connection } from "mongoose"
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Category } from "./category";
import { Product } from "./product";


export class Section {
    @prop({ ref: () => Category, required: true })
    public category?: Ref<Category>;

    @prop({ ref: () => Product, default: [] })
    public products?: [Ref<Product>];
}

export class Menu {
    @prop({ required: true })
    public name!: string;

    @prop({ default: [], type: () => Section })
    public sections?: Section[];

    @prop({ default: Date.now() })
    public created_date!: Date;
}



export const MenuModel = (conn: Connection) =>
    getModelForClass(Menu, { existingConnection: conn, schemaOptions: { collection: 'Menu' } })
