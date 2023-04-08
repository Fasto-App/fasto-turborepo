import { ProductModel, UserModel } from "../../../models";
import { Context } from "../types";

const getProductByCartItem = async (parent: any, args: any, { db }: Context) => {
  const Product = ProductModel(db);
  const product = await Product.findById(parent.product);
  return product;
}

const getUserByCartItem = async (parent: any, args: any, { db }: Context) => {
  const User = UserModel(db);

  const foundUser = await User.findById(parent.user);
  return foundUser;
}


export const CartItemResolver = {
  getProductByCartItem,
  getUserByCartItem
}