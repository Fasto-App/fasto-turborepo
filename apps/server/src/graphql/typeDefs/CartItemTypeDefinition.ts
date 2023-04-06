import { gql } from "apollo-server-express";

export const CartItemTypeDefinition = gql`

  extend type Query {
    getCartItemsPerTab: [CartItem!]!
  }

  extend type Mutation {
    addItemToCart(input: addItemToCartInput!): CartItem!
    deleteItemFromCart(input: deleteItemFromCartInput!): CartItem!
    updateItemFromCart(input: updateItemFromCartInput!): CartItem!
  }

  input updateItemFromCartInput {
    cartItem: ID!
    quantity: Int!
  }

  input deleteItemFromCartInput {
    cartItem: ID!
  }

  input addItemToCartInput {
    product: ID!
    quantity: Int!
    notes: String
    options: [String]
  }

  type CartItem {
    _id: ID!
    user: User!
    tab: Tab!
    product: Product!
    quantity: Int!
    notes: String
    options: [String]
    subTotal: Float!
  }

`
