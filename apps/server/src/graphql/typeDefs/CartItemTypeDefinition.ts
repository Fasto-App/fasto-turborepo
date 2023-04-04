import { gql } from "apollo-server-express";

export const CartItemTypeDefinition = gql`

  extend type Query {
    getCartItemsPerTab(input: getCartItemsPerTabInput!): [CartItem!]!
  }

  extend type Mutation {
    addItemToCart(input: addItemToCartInput!): CartItem!
    deleteItemFromCart(input: deleteItemFromCartInput!): CartItem!
    updateItemFromCart(input: updateItemFromCartInput!): CartItem!
  }

  input updateItemFromCartInput {
    cartItem: ID!
    tab: ID!
    quantity: Int!
  }

  input deleteItemFromCartInput {
    cartItem: ID!
    tab: ID!
  }

  input getCartItemsPerTabInput {
    tab: ID!
  }

  input addItemToCartInput {
    tab: ID!
    product: ID!
    quantity: Int!
    notes: String
    options: [String]
  }

  type CartItem {
    _id: ID!
    tab: Tab!
    product: Product!
    quantity: Int!
    notes: String
    options: [String]
    subTotal: Float!
  }

`
