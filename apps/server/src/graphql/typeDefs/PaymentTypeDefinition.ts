import { gql } from "apollo-server-express";

export const PaymentTypeDefinition = gql`
  extend type Query {
    getCheckoutByID(input: GetById!): Checkout!
  }

  type Payment {
    _id: ID!
    amount: Float!
    patron: ID
    tip: Float
    splitType: SplitType
  }

`