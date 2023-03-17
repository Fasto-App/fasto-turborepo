import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from 'express';
import apolloServer from './graphql';
import { graphqlUploadExpress } from 'graphql-upload'
import { Bugsnag } from "./bugsnag/bugsnag";
import session from 'express-session';
import MongoStore from "connect-mongo"
import { MONGO_DB_URI } from "./constants";
import { dbConnection } from "./dbConnection";
import cors from 'cors';

const middleware = Bugsnag.getPlugin('express');
const PORT = process.env.PORT || 4000
const FRONTEND_URL = process.env.FRONTEND_URL as string

export const db = dbConnection();

async function main() {
  const app = express();
  // Configure session middleware
  // app.use(session({
  //   secret: 'keyboard cat',
  //   saveUninitialized: false, // don't create session until something stored
  //   resave: false, //don't save session if unmodified
  //   store: MongoStore.create({
  //     mongoUrl: MONGO_DB_URI,
  //     collectionName: "sessions",
  //     touchAfter: 24 * 3600, // time period in seconds
  //   })
  // }));
  app.use(session({
    secret: 'keyboard cat',
    cookie: {
      maxAge: 60000,
      httpOnly: true,
      domain: "http://localhost:3000/",
      secure: false
    },
  }));

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

