import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from 'express';
import apolloServer from './graphql';
import { graphqlUploadExpress } from 'graphql-upload'
import { Bugsnag } from "./bugsnag/bugsnag";
import cors from 'cors';

const middleware = Bugsnag.getPlugin('express');
const PORT = process.env.PORT || 4000
const FRONTEND_URL = process.env.FRONTEND_URL as string

async function main() {
  const app = express();
  app.use(middleware?.requestHandler!)
  app.use(middleware?.errorHandler!)
  app.use(express.static(__dirname + "/public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(graphqlUploadExpress());

  console.log("process.env.FRONTEND_URL", FRONTEND_URL)
  console.log("API_KEY", process.env.API_KEY)

  // app.use(cors({
  //   origin: function (origin, callback) {
  //     console.log("FRONTEND_URL", FRONTEND_URL)
  //     if (origin && origin.startsWith(FRONTEND_URL)) {
  //       callback(null, true)
  //     } else {
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   }
  // }));

  await bootstrapApolloServer(app);

  app.listen(PORT, () => {
    console.log(`[📝 GraphQL SERVER ] ready on PORT ${PORT}/graphql`);
  });
}

async function bootstrapApolloServer(expressApp: Express) {
  await apolloServer.start();

  apolloServer.applyMiddleware({ app: expressApp });
}

main();

