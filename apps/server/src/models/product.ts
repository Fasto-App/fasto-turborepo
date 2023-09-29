import { Types, Connection } from "mongoose";
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { Business } from "./business";
import { Category } from "./category";
export class Product {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public price!: number;

  @prop()
  public description?: string;

  @prop({ ref: () => Category })
  public category!: Ref<Category> | null;

  @prop({ required: true, ref: () => Business })
  public business!: Ref<Business>;

  @prop({ default: [] })
  public addons?: Types.ObjectId[];

  @prop()
  public quantity?: number;

  @prop()
  public imageUrl?: string;

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const ProductModel = (conn: Connection) =>
  getModelForClass(Product, { existingConnection: conn, schemaOptions: { collection: 'Product' } });
