import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloError } from "./ApolloErrorExtended/ApolloErrorExtended";
import { resolvers } from "./resolvers/GraphResolvers";
import { getClientFromToken, getUserFromToken } from "./resolvers/utils";
import { typeDefinitions } from "./typeDefs/typeDefinitions";
import {
  UserTypeDefinition,
  BusinessTypeDefinition,
  ProductTypeDefinition,
  CategoryTypeDefinition,
  TabTypeDefinition,
  MenuTypeDefinition,
  AddressTypeDefinition,
  OrderDetailsTypeDefinition,
  TableTypeDefinition,
  SpaceTypeDefinition,
  CheckoutTypeDefinition,
  PaymentTypeDefinition,
  RequestTypeDefinition,
  CartItemTypeDefinition
} from "./typeDefs";

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs: [
    typeDefinitions,
    CheckoutTypeDefinition,
    PaymentTypeDefinition,
    TabTypeDefinition,
    UserTypeDefinition,
    BusinessTypeDefinition,
    ProductTypeDefinition,
    CategoryTypeDefinition,
    MenuTypeDefinition,
    AddressTypeDefinition,
    OrderDetailsTypeDefinition,
    TableTypeDefinition,
    SpaceTypeDefinition,
    RequestTypeDefinition,
    CartItemTypeDefinition
  ],
})