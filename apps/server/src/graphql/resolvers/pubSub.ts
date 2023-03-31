import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const TAB_REQUEST = 'TAB_REQUEST';
export const NUMBER_INCREMENTED = 'NUMBER_INCREMENTED';