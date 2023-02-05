import { gql } from "apollo-server-express";

export const SpaceTypeDefinition = gql`

extend type Query {
  getSpacesFromBusiness: [Space!]
}

  extend type Mutation {
    createSpace(input: CreateSpaceInput): Space!
    deleteSpace(input: DeleteSpaceInput!): Space!
    updateSpace(input: UpdateSpaceInput!): Space!
  }

  input CreateSpaceInput {
    name: String!
  }

  input UpdateSpaceInput {
    id: ID!
    name: String
    description: String
    capacity: Int
    isAvailable: Boolean
}

type Space {
  _id: ID!
  name: String!
  business: ID!
  tables: [Table!]
  }

  input DeleteSpaceInput {
    space: ID!
  }

`