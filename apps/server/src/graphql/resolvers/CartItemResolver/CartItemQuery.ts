import { TabModel } from "../../../models";
import { CartItemModel } from "../../../models/cartItem";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

const getCartItemsPerTab = async (_parent: any, { input }: { input: any }, { db, client }: Context) => {

  const CartItem = CartItemModel(db);
  const Tab = TabModel(db);

  const foundTab = await Tab.findById(input.tab);
  if (!foundTab) throw ApolloError('NotFound')


  const cartItems = await CartItem.find({ tab: input.tab });
  return cartItems;
}


export const CartItemResolverQuery = {
  getCartItemsPerTab
}