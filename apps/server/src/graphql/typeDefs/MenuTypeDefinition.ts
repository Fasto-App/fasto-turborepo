import { gql } from "apollo-server-express";

export const MenuTypeDefinition = gql`

  extend type Mutation {
    createMenu(input: CreateMenuInput): Menu!
    updateMenu(input: UpdateMenuInput): Menu
    updateMenuInfo(input: UpdateMenuInfoInput): Menu!
    deleteMenu(id: ID!): Menu!
  }

  input CreateMenuInput {
  name: String!
}

  input UpdateMenuInfoInput {
    _id: ID!
    name: String!
  }

  input UpdateMenuInput {
    _id: ID!
    name: String
    sections: [UpdateSectionInput]
  }

  type Menu {
    _id: ID!
    name: String!
    sections: [Section!]
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
    products: [Product!]
  }



`