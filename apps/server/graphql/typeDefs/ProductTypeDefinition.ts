import { gql } from "apollo-server-express";

export const ProductTypeDefinition = gql`
  extend type Query {
    getAllProductsByBusinessID: [Product]!
    getProductByID(productID: ID!): Product
  }
  
  extend type Mutation {
    updateProductByID(input: UpdateProductInput!): Product!
    createProduct(input: CreateProductInput!): Product!
    deleteProduct(id: ID!): RequestResponseOK
  }

  type Product {
  _id: ID!
  name: String!
  description: String
  price: Int!
  imageUrl: String
  addonsID: [ID]
  category: Category
}

  input CreateProductInput {
    name: String!
    description: String
    price: Int!
    file: String
    addons: [CreateProductInput]
    category: ID!
  }

input UpdateProductInput {
  _id: ID!
  name: String!
  description: String
  price: Int!
  file: String
  category: ID!
}


`