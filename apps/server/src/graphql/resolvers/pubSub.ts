import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const TAB_REQUEST = "TAB_REQUEST";
export const TAB_REQUEST_RESPONSE = "TAB_REQUEST_RESPONSE";
export const NUMBER_INCREMENTED = "NUMBER_INCREMENTED";
