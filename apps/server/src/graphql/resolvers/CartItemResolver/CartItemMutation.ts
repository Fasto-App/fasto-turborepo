

import { TabModel, ProductModel, RequestModel } from "../../../models";
import { CartItemModel } from "../../../models/cartItem";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

type addItemToCartInput = {
  product: string,
  quantity: number,
  notes: string,
  options: string[],
}

const addItemToCart = async (_parent: any, { input }: { input: addItemToCartInput }, { db, client }: Context) => {
  if (!client) throw ApolloError('Unauthorized', "Invalid token", "client")

  const Tab = TabModel(db);
  const CartItem = CartItemModel(db);
  const Product = ProductModel(db);
  const Request = RequestModel(db);

  const foundRequest = await Request.findById(client.request);
  if (!foundRequest) throw ApolloError('NotFound')

  const foundTab = await Tab.findById(foundRequest.tab);
  if (!foundTab) throw ApolloError('NotFound')

  const foundProduct = await Product.findById(input.product);
  if (!foundProduct) throw ApolloError('NotFound')

  // if the item is already in the cart, we just update the quantity
  const foundCartItem = await CartItem.findOne({
    tab: foundTab._id,
    product: foundProduct._id,
    user: client?._id
  });

  if (foundCartItem) {
    foundCartItem.quantity += input.quantity;
    foundCartItem.subTotal += input.quantity * foundProduct.price;
    await foundCartItem.save();
    return foundCartItem;
  }

  const cartItem = await CartItem.create({
    user: client?._id,
    tab: foundTab._id,
    product: foundProduct._id,
    quantity: input.quantity,
    notes: input.notes,
    options: input.options,
    subTotal: input.quantity * foundProduct.price,
  });

  foundTab.cartItems = [...foundTab.cartItems, cartItem._id]
  await foundTab.save();

  return cartItem;
}

type updateItemFromCartInput = {
  cartItem: string,
  quantity: number,
}

// resolver to update item from cart
const updateItemFromCart = async (_parent: any, { input }: { input: updateItemFromCartInput }, { db, client }: Context) => {
  if (!client) throw ApolloError('Unauthorized', "Invalid token", "client")

  const Request = RequestModel(db);

  const foundRequest = await Request.findById(client.request);
  if (!foundRequest) throw ApolloError('NotFound')

  const CartItem = CartItemModel(db);
  const Tab = TabModel(db);

  const foundTab = await Tab.findById(foundRequest.tab);
  const foundCartItem = await CartItem.findById(input.cartItem);

  if (!foundTab) throw ApolloError('NotFound', 'Tab not found')
  if (!foundCartItem) throw ApolloError('NotFound', 'Cart item not found')

  // make sure that the cart item belongs to the user
  if (foundCartItem?.user?.toString() !== client?._id) {
    throw ApolloError('Unauthorized', "Invalid token", "client")
  }

  // update the quantity
  foundCartItem.quantity = input.quantity;
  await foundCartItem.save();

  return foundCartItem;
}

type deleteItemFromCartInput = {
  cartItem: string,
  tab: string,
}

const deleteItemFromCart = async (_parent: any, { input }: { input: deleteItemFromCartInput }, { db, client }: Context) => {
  if (!client) throw ApolloError('Unauthorized', "Invalid token", "client")

  const Request = RequestModel(db);

  const foundRequest = await Request.findById(client.request);
  if (!foundRequest) throw ApolloError('NotFound')

  const CartItem = CartItemModel(db);
  const Tab = TabModel(db);

  // from the input get the tab id and the cart item id
  const foundTab = await Tab.findById(foundRequest.tab);
  const foundCartItem = await CartItem.findById(input.cartItem);

  if (!foundTab) throw ApolloError('NotFound')
  if (!foundCartItem) throw ApolloError('NotFound')

  // make sure that the cart item belongs to the user
  if (foundCartItem?.user?.toString() !== client?._id.toString()) {
    throw ApolloError('Unauthorized', "Invalid token", "client")
  }

  // remove the cart item from the tab
  foundTab.cartItems = foundTab.cartItems.filter(cartItem => cartItem?.toString() !== foundCartItem._id.toString());
  await foundTab.save();

  // delete the cart item
  await foundCartItem.remove();

  return foundCartItem;
}

export const CartItemResolverMutation = {
  addItemToCart,
  deleteItemFromCart,
  updateItemFromCart
}