import { gql } from "apollo-server-express";

export const BusinessTypeDefinition = gql`
  extend type Query {
    getBusinessByID: Business
    getAllBusinessByUser: [Business]
    getAllBusiness: [Business]
    getAllMenusByBusinessID: [Menu]!
    getMenuByID: Menu
  }

  extend type Mutation {
    createBusiness(input: BusinessInput): CreateBusinessPayload
    updateBusiness(input: UpdateBusinessInput): Business
    deleteBusiness(businessID: ID!): DeleteBusinessPayload
    updateBusinessToken(input: String): String
  }

  input BusinessInput {
    name: String!
    phone: String!
    website: String
    address: AddressInput
  }

    type CreateBusinessPayload {
    business: Business!
    token: String
  }

  type Business {
    _id: ID!
    user: ID
    name: String!
    email: String!
    website: String!
    price_range: String
    cuisine: [String!]
    menus: [Menu!]
    address: Address
    categories: [Category!]!
    products: [Product!]!
  }

  type DeleteBusinessPayload {
    success: Boolean!
    message: String
  }

  input UpdateBusinessInput {
  _id: ID!
  business: BusinessInput!
}

`