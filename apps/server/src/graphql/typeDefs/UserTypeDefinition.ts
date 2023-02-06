import { gql } from "apollo-server-express";

export const UserTypeDefinition = gql`
  extend type Query {
      """
      Returns a user based on the Bearer token
      """
    getToken: User
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
    addEmployeeToBusiness(input: AddEmployeeInput!): User!
  }

  type AccountCreationResponse {
    ok: Boolean!
    url: String
  }

  input AddEmployeeInput {
    name: String!
    email: String!
    privileges: UserPrivileges!
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
  } 

  type User {
    _id: ID!
    name: String
    email: String!
    token: String!
    business: [BusinessPrivileges]!
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

  type BusinessPrivileges {
    business: String!
    privileges: [UserPrivileges]!
  }

`