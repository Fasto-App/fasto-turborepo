import { gql } from "apollo-server-express";

export const typeDefinitions = gql`
  scalar Upload

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
    uploadFile(file: Upload!): String!
  }

  type Subscription {
    _empty: String
  }

  type RequestResponseOK {
    ok: Boolean
  }


  input GetById {
    _id: ID!
  }

`;