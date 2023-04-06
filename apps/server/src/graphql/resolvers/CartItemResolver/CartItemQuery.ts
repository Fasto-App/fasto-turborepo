import { RequestModel, TabModel } from "../../../models";
import { CartItemModel } from "../../../models/cartItem";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

const getCartItemsPerTab = async (_parent: any, args: any, { db, client }: Context) => {

  if (!client) {
    throw ApolloError('Unauthorized', "invalid client token", "client")
  }

  const Request = RequestModel(db);

  const foundRequest = await Request.findById(client.request);
  if (!foundRequest) throw ApolloError('NotFound')

  const CartItem = CartItemModel(db);
  const Tab = TabModel(db);


  const foundTab = await Tab.findById(foundRequest.tab);
  if (!foundTab) throw ApolloError('NotFound')

  console.log('foundRequest', foundRequest)
  console.log('foundTab', foundTab)

  const cartItems = await CartItem.find({ tab: foundTab._id });

  console.log('cartItems', cartItems)


  return cartItems;
}


export const CartItemResolverQuery = {
  getCartItemsPerTab
}