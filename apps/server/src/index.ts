import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { schema } from "./graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { Bugsnag } from "./bugsnag/bugsnag";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { expressMiddleware } from "@apollo/server/express4";
import {
	getClientFromToken,
	getUserFromToken,
} from "./graphql/resolvers/utils";
import { ApolloError } from "./graphql/ApolloErrorExtended/ApolloErrorExtended";
import { dbConnection } from "./dbConnection";
import { Context } from "./graphql/resolvers/types";
import { Locale, locales } from "app-helpers";
import { confirmPaymentWebHook, stripe } from "./stripe";

const middleware = Bugsnag.getPlugin("express");
const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const db = dbConnection();

const apolloServer = new ApolloServer<Context>({
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
			},
		},
	],
	csrfPrevention: true,
	cache: "bounded",
	// @ts-ignore
	uploads: false,
	introspection: process.env.ENVIRONMENT === "development",
	formatError: (error) => {
		console.log("Error: 👹 ", error.message, "👹");
		return error;
	},
});

// Creating the WebSocket server
const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
// eslint-disable-next-line react-hooks/rules-of-hooks
const serverCleanup = useServer(
	{
		schema,
		context: async (ctx, msg, args) => {
			const bearerToken = ctx?.connectionParams?.["Authorization"] as
				| string
				| undefined;
			const clientBearerToken = ctx?.connectionParams?.clientauthorization as
				| string
				| undefined;
			const headersAPIKey = ctx?.connectionParams?.["x-api-key"] as
				| string
				| undefined;
			const locale = ctx?.connectionParams?.["accept-language"] as
				| string
				| undefined;

			return await proccessContext({
				headersAPIKey,
				businessToken: bearerToken,
				clientToken: clientBearerToken,
				locale: locales.find((l) => l === locale) ? (locale as Locale) : "en",
			});
		},
		onError: (err) => {},
		onDisconnect: () => {},
		onConnect: async () => true,
	},
	wsServer,
);

async function main() {
	app.use(middleware?.requestHandler!);
	app.use(middleware?.errorHandler!);
	app.use(express.static(__dirname + "/public"));
	app.use(express.urlencoded({ extended: true }));
	app.use(graphqlUploadExpress());

	await apolloServer.start();

	// TODO: Configure CORS
	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		express.json(),
		expressMiddleware(apolloServer, {
			context: async ({ req }) => {
				const bearerToken = req.headers.authorization;
				const clientBearerToken = req.headers.clientauthorization as
					| string
					| undefined;
				const headersAPIKey = req.headers["x-api-key"] as string | undefined;
				const locale = req.headers["accept-language"] as string | undefined;

				return await proccessContext({
					headersAPIKey,
					businessToken: bearerToken,
					clientToken: clientBearerToken,
					locale: locales.find((l) => l === locale) ? (locale as Locale) : "en",
				});
			},
		}),
	);

	if (process.env.ENVIRONMENT === "development") {
		app.use(
			"/voyager",
			voyagerMiddleware({
				endpointUrl: "/graphql",
				headersJS: JSON.stringify({
					["x-api-key"]: process.env.API_KEY || "",
				}),
			}),
		);
	}

	app.post(
		"/webhook/br",
		express.raw({ type: "application/json" }),
		async (request, response) => {
			const sig = request.headers["stripe-signature"];
			let event;

			try {
				if (!sig || !process.env.STRIPE_WEBHOOK_SECRET_BRAZIL) {
					throw "No Stripe signature";
				}

				event = stripe("BR").webhooks.constructEvent(
					request.body,
					sig,
					process.env.STRIPE_WEBHOOK_SECRET_BRAZIL,
				);
			} catch (err) {
				// @ts-ignore
				response.status(400).send(`Webhook Error: ${err.message}`);
				return;
			}

			// Handle the event
			switch (event.type) {
				case "payment_intent.created":
					const paymentCreated = event.data.object;
					break;
				case "payment_intent.succeeded":
					const paymentIntentSucceeded = event.data.object;
					// @ts-ignore
					confirmPaymentWebHook(paymentIntentSucceeded.metadata, db);
					break;
				// ... handle other event types
				default:
					console.log(`Unhandled event type ${event.type}`);
			}

			// Return a 200 response to acknowledge receipt of the event
			response.send();
		},
	);

	app.post(
		"/webhook",
		express.raw({ type: "application/json" }),
		async (request, response) => {
			const sig = request.headers["stripe-signature"];
			let event;

			try {
				if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
					throw "No Stripe signature";
				}

				event = stripe("US").webhooks.constructEvent(
					request.body,
					sig,
					process.env.STRIPE_WEBHOOK_SECRET,
				);
			} catch (err) {
				// @ts-ignore
				response.status(400).send(`Webhook Error: ${err.message}`);
				return;
			}

			// Handle the event
			switch (event.type) {
				case "payment_intent.created":
					const paymentCreated = event.data.object;
					break;
				case "payment_intent.succeeded":
					const paymentIntentSucceeded = event.data.object;
					try {
						// @ts-ignore
						confirmPaymentWebHook(paymentIntentSucceeded.metadata, db);
					} catch {
						// @ts-ignore
						response.status(400).send(`Webhook Error: ${err.message}`);
					}
					break;
				default:
					console.log(`Unhandled event type ${event.type}`);
			}

			// Return a 200 response to acknowledge receipt of the event
			response.send();
		},
	);

	httpServer.listen(PORT, () => {
		console.log(
			`[🚀 GraphQL SERVER] ready at http://localhost:${PORT}/graphql`,
		);
		console.log(
			`[📬 Subscription ENDPOINT] ready at ws://localhost:${PORT}/graphql`,
		);
		console.log(`[🧨 VOYAGER URL] ready at http://localhost:${PORT}/voyager`);
	});
}

main();

type ProccessContext = {
	headersAPIKey?: string;
	businessToken?: string;
	clientToken?: string;
	locale: Locale;
};
async function proccessContext({
	businessToken,
	clientToken,
	headersAPIKey,
	locale,
}: ProccessContext) {
	if (!process.env.API_KEY || headersAPIKey !== process.env.API_KEY) {
		throw ApolloError(
			new Error("NOT AUTHORIZED: invalid API key 🔑"),
			"Unauthorized",
		);
	}

	const userFromToken = await getUserFromToken(businessToken?.split(" ")[1]);
	const clientFromToken = await getClientFromToken(clientToken?.split(" ")[1]);

	return {
		db,
		locale,
		user: userFromToken,
		business: userFromToken?.business,
		client: clientFromToken,
	};
}

// let currentNumber = 0;
// function incrementNumber() {
//   currentNumber++;
//   pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
//   setTimeout(incrementNumber, 1000);
// }

// Start incrementing
// incrementNumber();
