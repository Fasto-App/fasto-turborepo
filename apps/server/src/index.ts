import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from 'express';
import apolloServer from './graphql';
import { graphqlUploadExpress } from 'graphql-upload'
import { Bugsnag } from "./bugsnag/bugsnag";

const middleware = Bugsnag.getPlugin('express');
const PORT = process.env.PORT || 4000

async function main() {
  const app = express();
  app.use(middleware?.requestHandler!)
  app.use(middleware?.errorHandler!)
  app.use(express.static(__dirname + "/public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(graphqlUploadExpress());

  await bootstrapApolloServer(app);

  app.listen(PORT, () => {
    console.log(`[📝 GraphQL SERVER ] ready on PORT ${PORT}/graphql`);
    console.log(`[🚀 Next APP ] ready on PORT ${3000}`);
  });
}

async function bootstrapApolloServer(expressApp: Express) {
  await apolloServer.start();

  apolloServer.applyMiddleware({ app: expressApp });
}

main();

