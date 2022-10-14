import { gql } from "apollo-server-express";

export const UserTypeDefinition = gql`
  extend type Query {
      """
      Returns a user based on the Bearer token
      """
    getUserByToken: User
    getAllUsers: [User!]!
    getUserByID(userID: ID): User
  }

  extend type Mutation {
    requestUserAccountCreation(input: RequestUserAccountInput): AccountCreationResponse!
    createUser(input: UserInput): User!
    postUserLogin(input: loginInput!): User!
    updateUserInformation(input: UpdateUserInput!): User!
    recoverPassword(input: String!): RequestResponseOK
    deleteUser: RequestResponseOK!
  }

  type AccountCreationResponse {
    ok: Boolean!
    url: String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    passwordConfirmation: String!
    privileges: UserPrivileges
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    privileges: UserPrivileges
    passwordConfirmation: String
    _id: ID
  }

  input RequestUserAccountInput{
    email: String!
    emailConfirmation: String!
  } 

  type User {
    _id: ID!
    name: String
    email: String!
    token: String!
    privileges: UserPrivileges
  }

  input loginInput {
    email: String!
    password: String!
  }

  enum UserPrivileges {
    ADMIN
    MANAGER
    USER
    WAITER
    COOK
    BAR
    BARTENDER
  }



`