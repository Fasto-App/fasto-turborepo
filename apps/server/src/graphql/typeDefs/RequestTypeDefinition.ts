import { gql } from "apollo-server-express";

export const RequestTypeDefinition = gql`


  extend type Query {
    getTabRequest: Request
  }

  extend type Mutation {
    openTabRequest(input: OpenTabRequestInput!): String
  }

  input OpenTabRequestInput {
    business: ID!
    phoneNumber: String!
    name: String!
    totalGuests: Int!
    names: [String]
  }

  type Request {
    _id: ID!
    business: ID!
    admin: ID!
    totalGuests: Int!
    names: [String]
    createdAt: String!
    status: RequestStatus!
  }

  enum RequestStatus {
    Pending
    Accepted
    Rejected
    Canceled
    Completed
    Expired
  }

`