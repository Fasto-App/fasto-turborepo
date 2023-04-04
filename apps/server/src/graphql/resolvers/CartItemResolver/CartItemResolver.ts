import { ProductModel } from "../../../models";
import { Context } from "../types";

const getProductByCartItem = async (parent: any, args: any, { db }: Context) => {
  const Product = ProductModel(db);
  const product = await Product.findById(parent.product);
  return product;
}

export const CartItemResolver = {
  getProductByCartItem
}