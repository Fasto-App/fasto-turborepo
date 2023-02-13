import { gql } from "apollo-server-express";

export const UserTypeDefinition = gql`
  extend type Query {
      """
      Returns a user based on the Bearer token
      """
    getToken: User
    getAllUsers: [User!]!
    getUserInformation: User
  }

  extend type Mutation {
    requestUserAccountCreation(input: RequestUserAccountInput): AccountCreationResponse!
    createUser(input: UserInput): User!
    postUserLogin(input: LoginInput!): User!
    updateUserInformation(input: UpdateUserInput!): User!
    recoverPassword(input: String!): RequestResponseOK
    deleteUser: RequestResponseOK!
    addEmployeeToBusiness(input: AddEmployeeInput!): User!
    resetPassword(input: ResetPasswordInput!): User!
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
    name: String!
    email: String!
    picture: Upload
    oldPassword: String
    newPassword: String
    newPasswordConfirmation: String
  }

  input RequestUserAccountInput{
    email: String!
  } 

  type User {
    _id: ID!
    name: String!
    email: String!
    token: String!
    picture: String
    businesses: [BusinessPrivileges!]!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ResetPasswordInput {
    password: String!
    passwordConfirmation: String!
    token: String!
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