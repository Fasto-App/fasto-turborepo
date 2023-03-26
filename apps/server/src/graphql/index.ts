import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloError } from "./ApolloErrorExtended/ApolloErrorExtended";
import { resolvers } from "./resolvers/GraphResolvers";
import { getClientFromToken, getUserFromToken } from "./resolvers/utils";
import { typeDefinitions } from "./typeDefs/typeDefinitions";
import {
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
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
  RequestTypeDefinition
} from "./typeDefs";
import { db } from "..";



function logUserCredentialsValid(userFromToken: boolean) {
  console.log("BACKEND: ID, EMAIL, BUSINESS  🔐 ", userFromToken ? "✅" : "❌");
}

const schema = makeExecutableSchema({
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
    RequestTypeDefinition
  ],
})

const server = new ApolloServer({
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  csrfPrevention: true,
  cache: 'bounded',
  // @ts-ignore
  uploads: false,
  schema,
  introspection: process.env.ENVIRONMENT === "development",
  context: async ({ req }) => {
    const bearerToken = req.headers.authorization;
    const clientBearerToken = req.headers.clientauthorization as string | undefined;

    if (req.headers["x-api-key"] !== process.env.API_KEY) {
      console.log("NOT AUTHORIZED: invalid API key 🔑")
      console.log(req.headers["x-api-key"], process.env.API_KEY)
      throw ApolloError('Unauthorized');
    }

    const userFromToken = await getUserFromToken(bearerToken?.split(' ')[1]);
    const clientFromToken = await getClientFromToken(clientBearerToken?.split(' ')[1]);

    // console.log("🔐 User clientBearerToken: ")
    // console.log("clientFromToken", clientFromToken)
    // logUserCredentialsValid(!!userFromToken?.business);

    return {
      db,
      user: userFromToken,
      business: userFromToken?.business,
      client: clientFromToken
    };
  },
  formatError: (error) => {

    console.log("Error: 👹 ", error.message, "👹")
    return error;
  }
});

export default server;