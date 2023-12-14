import { RequestModel, TabModel } from "../../../models";
import { CartItemModel } from "../../../models/cartItem";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

const getCartItemsPerTab = async (_parent: any, args: any, { db, client }: Context) => {

  if (!client) {
    throw ApolloError(new Error("invalid client token"), 'Unauthorized')
  }

  const Request = RequestModel(db);

  const foundRequest = await Request.findById(client.request);
  if (!foundRequest) throw ApolloError(new Error("no request"), 'NotFound')

  const CartItem = CartItemModel(db);
  const Tab = TabModel(db);

  const foundTab = await Tab.findById(foundRequest.tab);
  if (!foundTab) throw ApolloError(new Error("no tab"), 'NotFound')

  const cartItems = await CartItem.find({ tab: foundTab._id });

  return cartItems;
}


export const CartItemResolverQuery = {
  getCartItemsPerTab
}