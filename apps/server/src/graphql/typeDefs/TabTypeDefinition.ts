import { gql } from "apollo-server-express";

export const TabTypeDefinition = gql`
  extend type Query {
    getTabByID(input: GetById!): Tab
    getAllTabsByBusinessID: [Tab]
    getAllOpenTabsByBusinessID: [Tab]
  }

  extend type Mutation {
    createTab(input: CreateTabInput!): Tab!
    updateTab(input: UpdateTabInput!): Tab!
    deleteTab(input: GetById!): Tab
    requestCloseTab(input: GetById!): Tab!
  }

  type Tab {
  _id: ID!
  checkout: ID
  table: Table!
  admin: ID!
  orders: [OrderDetail!]!
  status: TabStatus!
  users: [User!]
  created_date: String!
  completed_at: String
}

  input CreateTabInput {
    table: ID!
    admin: ID
    totalUsers: Int!
  }

  input UpdateTabInput {
    _id: ID!
    status: TabStatus!
  }

  enum TabStatus{
    Open
    Closed  
    Pendent
  }

`
