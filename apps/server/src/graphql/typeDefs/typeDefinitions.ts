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

  input UpdateSectionInput {
    category: ID!
    products: [ID]
  }

  input SectionInput {
    name: String!
    products: [String!]!
  }

  type Section {
    category: ID!
    products: [ID!]
  }

  type RequestResponseOK {
    ok: Boolean
  }


  input GetById {
    _id: ID!
  }

`;