import { gql } from "apollo-server-express";

export const CategoryTypeDefinition = gql`
  extend type Query {
    getAllCategoriesByBusiness: [Category!]!
    getCategoryByID(id: ID!): Category
  }
  
  extend type Mutation {
    createCategory(input: CategoryInput): Category
    linkCategoryToProducts(input: LinkCategoryToProductInput!): Category
    updateCategory(input: UpdateCategoryInput): Category
    deleteCategory(id: ID!): RequestResponseOK
  }

  type Category {
    _id: ID!
    name: String!
    description: String
    parentCategory: Category
    subCategories: [Category]
    products: [Product]
  }

  input CategoryInput {
  name: String!
  description: String
  parentCategory: ID
  subCategories: [ID]
}

  input UpdateCategoryInput {
    _id: ID!
    name: String
    description: String
    parentCategory: ID
    subCategories: [String]
  }


input LinkCategoryToProductInput {
  products: [String]!
  category: ID!
}

`