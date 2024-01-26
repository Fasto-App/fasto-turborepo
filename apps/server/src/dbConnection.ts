import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

function dbConnection() {
	mongoose.Promise = global.Promise;
	mongoose.connect(
		process.env.MONGO_DB_URI ?? "",
		{
			dbName: process.env.DB_NAME,
			//@ts-ignore
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useCreateIndex: true,
			// useFindAndModify: false,
		},
		(err) => {
			if (err) console.log({ err: `mongoDB Error ${err}` });
			else console.log({ msg: "mongoDB connected" });
		},
	);

	return mongoose.connection;
}

export { dbConnection };
