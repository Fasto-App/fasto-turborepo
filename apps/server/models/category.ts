import { Types, SchemaTypes, Schema, SchemaDefinition, Connection } from 'mongoose'
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Product } from './product';



export class Category {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public business!: Types.ObjectId;

  @prop()
  public description?: string;

  @prop({ ref: () => Category })
  public parentCategory?: Ref<Category, string>;

  @prop({ ref: () => Category, default: [] })
  public subCategories!: String[];

  @prop({ ref: () => Product, default: [] })
  public products?: [String];

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const CategoryModel = (conn: Connection) => getModelForClass(Category, { existingConnection: conn, schemaOptions: { collection: 'Category' } });
