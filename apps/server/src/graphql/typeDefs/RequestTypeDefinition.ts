import { gql } from "apollo-server-express";

export const RequestTypeDefinition = gql`

  extend type Query {
    getTabRequest: Request!
    getTabRequests(input: GetTabRequestInput): [Request!]!
  }

  extend type Mutation {
    openTabRequest(input: OpenTabRequestInput!): String
    acceptTabRequest(input: AcceptTabRequestInput!): Request
    declineTabRequest(input: GetById!): Request
  }

  input GetTabRequestInput {
    filterBy: RequestStatus
  }

  input OpenTabRequestInput {
    business: ID!
    phoneNumber: String!
    name: String!
    totalGuests: Int!
    names: [String]
  }

  input AcceptTabRequestInput {
    request: ID!
    table: String
  }

  type Request {
    _id: ID!
    business: ID!
    admin: User!
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