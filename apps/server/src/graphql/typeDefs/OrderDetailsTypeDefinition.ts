import { gql } from "apollo-server-express";

export const OrderDetailsTypeDefinition = gql`
  extend type Query {
    getOrderDetailByID(orderDetailID: ID!): OrderDetail
    getAllOrderDetailsByOrderID(orderID: ID!): [OrderDetail]
  }

  extend type Mutation {
    createOrderDetail(input: CreateOrderInput!): OrderDetail
    createMultipleOrderDetails(input: [CreateOrderInput!]!): [OrderDetail!]
    updateOrderDetail(input: UpdateOrderDetailInput!): OrderDetail
    deleteOrderDetail(input: GetById!): OrderDetail
  }

  input CreateOrderInput {
    user: ID
    tab: ID!
    product: ID!
    quantity: Int!
    message: String
  }

  input OrderDetailInput {
    product: ID!
    quantity: Int
    message: String
  }

  input UpdateOrderDetailInput {
    _id: ID!
    status: OrderStatus
    quantity: Int
    message: String
  }

  type OrderDetail {
    _id: ID!
    product: ID!
    user: ID
    quantity: Int!
    subTotal: Int!
    status: OrderStatus!
    message: String
    created_date: String!
  }

  enum OrderStatus {
    DELIVERED
    PENDENT 
    OPEN 
    CLOSED
  }

`