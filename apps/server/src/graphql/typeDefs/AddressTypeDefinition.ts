import { gql } from "apollo-server-express";

export const AddressTypeDefinition = gql`
  extend type Query {
    getAddress(id: ID!): Address!
  }

  extend type Mutation {
    createAddress(input: AddressInput!): Address
    updateAddress(input: UpdateAddressInput): Address
  }

  input UpdateAddressInput {
    _id: ID!
    streetName: String
    streetNumber: String
    zipcode: String
    city: String
  }

  type Address {
    id: ID!
    city: String!
    zipcode: String!
    streetName: String!
    streetNumber: String!
  }

  input AddressInput {
    city: String!
    zipcode: String!
    streetName: String!
    streetNumber: String!
  }

  type Geo {
  lat: Float!
  lng: Float!
}
`