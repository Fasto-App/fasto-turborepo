import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from '@graphql-tools/schema'
import { dbConnection } from '../dbConnection';
import { ApolloExtendedError } from "./ApolloErrorExtended/ApolloErrorExtended";
import { resolvers } from "./resolvers/GraphResolvers";
import { getUserFromToken } from "./resolvers/utils";
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
  SpaceTypeDefinition
} from "./typeDefs";



const db = dbConnection();

function logUserCredentialsValid(userFromToken: boolean) {
  console.log("BACKEND: ID, EMAIL, BUSINESS  🔐 ", userFromToken ? "✅" : "❌");
}

const schema = makeExecutableSchema({
  resolvers,
  typeDefs: [
    typeDefinitions,
    TabTypeDefinition,
    UserTypeDefinition,
    BusinessTypeDefinition,
    ProductTypeDefinition,
    CategoryTypeDefinition,
    MenuTypeDefinition,
    AddressTypeDefinition,
    OrderDetailsTypeDefinition,
    TableTypeDefinition,
    SpaceTypeDefinition
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
  introspection: true,
  context: async ({ req }) => {
    const tokenSecret = process.env.TOKEN_SECRET;
    const bearerToken = req.headers.authorization || '';

    if (!tokenSecret) throw new Error('Token secret or bearer token not found');

    if (req.headers["x-api-key"] !== process.env.API_KEY) {
      console.log("NOT AUTORIZED")
      console.log(req.headers["x-api-key"], process.env.API_KEY)
      return new ApolloExtendedError('Invalid API key 🔑');
    }

    const userFromToken = await getUserFromToken(bearerToken.split(' ')[1], tokenSecret);

    if (!userFromToken?._id) return { db };

    logUserCredentialsValid(!!userFromToken?.business);

    return { db, user: userFromToken, business: userFromToken.business };
  },
  formatError: (error) => {
    return error;
  }
});

export default server;