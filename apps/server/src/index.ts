import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { schema } from './graphql';
import { graphqlUploadExpress } from 'graphql-upload'
import { Bugsnag } from "./bugsnag/bugsnag";
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from '@apollo/server/express4';
import { getClientFromToken, getUserFromToken } from "./graphql/resolvers/utils";
import { ApolloError } from "./graphql/ApolloErrorExtended/ApolloErrorExtended";
import { dbConnection } from "./dbConnection";
import { pubsub } from "./graphql/resolvers/pubSub";

const middleware = Bugsnag.getPlugin('express');
const PORT = process.env.PORT || 4000

const app = express();
const httpServer = createServer(app);
const db = dbConnection();

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            // This will be called when the server is shutting down.
            // We can use this to close the WebSocket server.
            await serverCleanup.dispose();
          },
        };
      }
    }
  ],
  csrfPrevention: true,
  cache: 'bounded',
  // @ts-ignore
  uploads: false,
  introspection: process.env.ENVIRONMENT === "development",
  formatError: (error) => {
    console.log("Error: 👹 ", error.message, "👹")
    return error;
  }
});

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
// eslint-disable-next-line react-hooks/rules-of-hooks
const serverCleanup = useServer({
  schema,
  context: async (ctx, msg, args) => {

    const bearerToken = ctx?.connectionParams?.["Authorization"] as string | undefined;
    const clientBearerToken = ctx?.connectionParams?.clientauthorization as string | undefined;
    const headersAPIKey = ctx?.connectionParams?.["x-api-key"] as string | undefined;

    console.log("ctx?.connectionParams", ctx?.connectionParams)
    console.log("🔐 User clientBearerToken: ")
    console.log("clientFromToken", clientBearerToken)

    return await proccessContext({
      headersAPIKey,
      businessToken: bearerToken,
      clientToken: clientBearerToken
    });
  },
  onError: (err) => console.log("Error: ", err),
  onDisconnect: () => console.log("Disconnected"),
  onConnect: async () => {
    console.log("Connected");
    return true;
  },
},
  wsServer);

async function main() {
  app.use(middleware?.requestHandler!)
  app.use(middleware?.errorHandler!)
  app.use(express.static(__dirname + "/public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(graphqlUploadExpress());

  await apolloServer.start();

  // todo: Configure CORS
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const bearerToken = req.headers.authorization;
      const clientBearerToken = req.headers.clientauthorization as string | undefined;
      const headersAPIKey = req.headers["x-api-key"] as string | undefined;

      return await proccessContext({
        headersAPIKey,
        businessToken: bearerToken,
        clientToken: clientBearerToken
      });
    }
  }));

  httpServer.listen(PORT, () => {
    console.log(`[🚀 GraphQL SERVER] ready at http://localhost:${PORT}/graphql`);
    console.log(`[📬 Subscription ENDPOINT] ready at ws://localhost:${PORT}/graphql`);
  });
}

main();

async function proccessContext(
  { businessToken, clientToken, headersAPIKey }:
    { headersAPIKey?: string, businessToken?: string, clientToken?: string }) {
  if (headersAPIKey !== process.env.API_KEY) {
    console.log("NOT AUTHORIZED: invalid API key 🔑")
    console.log(headersAPIKey, process.env.API_KEY)
    throw ApolloError('Unauthorized');
  }

  const userFromToken = await getUserFromToken(businessToken?.split(' ')[1]);
  const clientFromToken = await getClientFromToken(clientToken?.split(' ')[1]);

  return {
    db,
    user: userFromToken,
    business: userFromToken?.business,
    client: clientFromToken,
  };
}

let currentNumber = 0;
function incrementNumber() {
  currentNumber++;
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}

// Start incrementing
incrementNumber();