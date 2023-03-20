import { gql } from "apollo-server-express";

export const UserTypeDefinition = gql`
  extend type Query {
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
    passwordReset(input: ResetPasswordInput!): User!
    createEmployeeAccount(input: CreateEmployeeAccountInput!): User!
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
    privilege: UserPrivileges
  }

  input CreateEmployeeAccountInput {
    name: String!
    email: String!
    password: String!
    passwordConfirmation: String!
    token: String!
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
    phoneNumber: String
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
    Admin
    View
    Manager
    Customer
    Staff
  }

  type BusinessPrivileges {
    business: String!
    privilege: UserPrivileges!
  }

`