import { gql } from "apollo-server-express";

export const TableTypeDefinition = gql`

  extend type Mutation {
    createTable(input: CreateTableInput): Table!
    deleteTable(input: DeleteTableInput): RequestResponseOK!
  }

  input CreateTableInput {
    space: ID!
  }

  input DeleteTableInput {
    table: ID!
  }

  type Table {
    _id: ID!
    space: ID!
    tableNumber: String!
    status: TableStatus!
    tab: Tab
  }

  enum TableStatus {
    Available
    Occupied
    Reserved
    Closed
  }



`