import { gql } from "apollo-server-express";

export const RequestTypeDefinition = gql`

  extend type Mutation {
    openTabRequest(input: OpenTabRequestInput!): String
  }

  input OpenTabRequestInput {
    phoneNumber: String!
    name: String!
    totalGuests: Int!
    names: [String]
  }

`