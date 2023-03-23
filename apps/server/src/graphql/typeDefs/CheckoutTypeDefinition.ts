import { gql } from "apollo-server-express";

export const CheckoutTypeDefinition = gql`
  extend type Query {
    getCheckoutByID(input: GetById!): Checkout!
  }

  extend type Mutation {
    makeCheckoutPayment(input: MakeCheckoutPaymentInput!): Checkout!
  }

  type Checkout {
    _id: ID!
    business: ID!
    tab: ID!
    status: CheckoutStatusKeys!
    paid: Boolean!
    orders: [OrderDetail]!
    payments: [Payment]!
    subTotal: Float!
    tip: Float!
    tax: Float!
    total: Float!
    totalPaid: Float!
    created_date: String!
  }

  input MakeCheckoutPaymentInput {
    checkout: ID!
    amount: Float!
    tip: Float!
    patron: ID!
    discount: Float!
    splitType: SplitType
    paymentMethod: String
  }

  enum CheckoutStatusKeys {
    Pending
    Paid
    PartiallyPaid
    Canceled
  }

  enum SplitType {
    ByPatron
    Equally
    Custom
  }

`