
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { MONGO_DB_URI } from "./constants";
dotenv.config();

const RAILWAY_MONGO_DB = "mongodb://mongo:8sIXR7VXmZ1d7fEZIYUn@containers-us-west-62.railway.app:6178"
function dbConnection() {

  mongoose.Promise = global.Promise;
  mongoose.connect(
    MONGO_DB_URI,
    {
      dbName: process.env.DB_NAME,
      //@ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    },
    (err) => {
      if (err) console.log({ err: `mongoDB Error ${err}` })
      else console.log({ msg: "mongoDB connected" })
    }
  );

  return mongoose.connection;
};

export { dbConnection };
