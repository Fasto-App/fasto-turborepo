import { Types, Connection } from "mongoose";
import { prop, getModelForClass, Ref, pre } from '@typegoose/typegoose';
import { Business } from "./business";
import { Category } from "./category";

const defaultImage = "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"

@pre<Product>('save', function () {

})
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

  @prop({ default: defaultImage })
  public imageUrl?: string;

  @prop({ default: Date.now() })
  public created_date!: Date;
}

export const ProductModel = (conn: Connection) =>
  getModelForClass(Product, { existingConnection: conn, schemaOptions: { collection: 'Product' } });
