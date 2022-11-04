
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// console.log("mongodb://mongo:8AkiVWxYNcVcjuRDDaHf@containers-us-west-85.railway.app:7492")
const RAILWAY_MONGO_DB = "mongodb://mongo:8sIXR7VXmZ1d7fEZIYUn@containers-us-west-62.railway.app:6178"
function dbConnection() {

  const oldUri = `mongodb+srv://dbOpenTab:${process.env.CLUSTER_PASSWORD}@cluster1.ml57r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

  const uri = oldUri

  mongoose.Promise = global.Promise;
  mongoose.connect(
    uri,
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
