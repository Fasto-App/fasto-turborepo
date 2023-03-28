import { gql } from "apollo-server-express";

export const MenuTypeDefinition = gql`

  extend type Query {
    getAllMenusByBusinessID: [Menu!]!
    getMenuByID(input: GetMenuById): Menu!
    getAllMenus: [Menu!]!
    getClientMenu(input: GetMenu!): Menu!
  }

  extend type Mutation {
    createMenu(input: CreateMenuInput!): Menu!
    updateMenu(input: UpdateMenuInput): Menu
    updateMenuInfo(input: UpdateMenuInfoInput): Menu!
    deleteMenu(id: ID!): Menu!
  }

  input GetMenu {
    _id: ID
    business: ID!
  }

  input CreateMenuInput {
    name: String!
  }

  input UpdateMenuInfoInput {
    _id: ID!
    name: String!
  }

  input GetMenuById {
    id: ID!
  }

  input UpdateMenuInput {
    _id: ID!
    name: String
    sections: [UpdateSectionInput]
    isFavorite: Boolean
  }

  type Menu {
    _id: ID!
    name: String!
    sections: [Section!]
    isFavorite: Boolean
  } 

  input UpdateSectionInput {
    category: ID!
    products: [ID]
  }

  input SectionInput {
    name: String!
    products: [String!]!
  }

  type Section {
    category: Category!
    products: [Product!]!
  }
`