import React from "react"
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context';
import { getClientCookies, getBusinessCookies } from '../cookies';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { errorLink } from './ErrorLink';
import Router from 'next/router';

export const AppApolloProvider: React.FC = ({ children }) => {
  const httpLink = createUploadLink({
    uri: process.env.BACKEND_URL,
  })

  const params = () => {
    const clientToken = typeof window !== "undefined" && getClientCookies(Router.query.businessId as string)
    const token = getBusinessCookies("token")

    return ({
      Authorization: token ? `Bearer ${token}` : "",
      "clientauthorization": clientToken ? `Bearer ${clientToken}` : "",
      "Apollo-Require-Preflight": "true",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY
    })
  }

  // todo change on Doppler
  const wsLink = typeof window === 'undefined' ? null :
    new GraphQLWsLink(createClient({
      url: process.env.SUBSCRIPTION_URL || 'ws://localhost:4000/graphql',
      retryAttempts: 5,
      on: {
        ping: () => console.log('ping'),
        pong: () => console.log('pong'),
        connecting: () => console.log('connecting'),
        connected: () => console.log('connected'),
        closed: () => console.log('closed'),
        error: () => console.log('error'),
      },
      connectionParams: params(),
    }));

  const authLink = setContext((_: any, { headers }) => {

    return {
      headers: {
        ...headers,
        ...params()
      }
    }
  });

  const splitLink = !wsLink ? httpLink : split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    // @ts-ignore
    httpLink,
  )

  const client = new ApolloClient({
    // @ts-ignore
    link: errorLink.concat(authLink.concat(splitLink)),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}