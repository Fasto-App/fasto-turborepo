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
    streetAddress: String!
    complement: String
    postalCode: String!
    city: String!
    stateOrProvince: String!
    country: String!
  }

  type Address {
    _id: ID!
    streetAddress: String!
    complement: String
    postalCode: String!
    city: String!
    stateOrProvince: String!
    country: String!
  }

  input AddressInput {
    streetAddress: String!
    complement: String
    postalCode: String!
    city: String!
    stateOrProvince: String!
    country: String!
  }

  type Geo {
  lat: Float!
  lng: Float!
}
`