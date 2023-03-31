import { gql } from "apollo-server-express";

export const RequestTypeDefinition = gql`

  extend type Query {
    getTabRequest: Request!
    getTabRequests(input: GetTabRequestInput): [Request!]!
    getPendingInvitations(input: GetPendingInvitationsInput!): [Request!]!
  }

  extend type Mutation {
    openTabRequest(input: OpenTabRequestInput!): String
    requestJoinTab(input: JoinTabForm!): String
    acceptTabRequest(input: AcceptTabRequestInput!): Request
    declineTabRequest(input: GetById!): Request!
    declineInvitation(input: GetById!): Request!
    acceptInvitation(input: GetById!): Request!
  }

  extend type Subscription {
    onTabRequest: Request!
    numberIncremented: Int!,
  }

  input GetPendingInvitationsInput {
    tab: ID!
  }

  input JoinTabForm {
    name: String!
    phoneNumber: String!
    tab: ID!
    admin: ID!
    business: ID!
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
    requestor: User!
    business: ID
    admin: User
    totalGuests: Int
    names: [String]
    status: RequestStatus!
    tab: ID
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