import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { clearClientCookies, clearCookies, getClientCookies, getCookies } from '../cookies/businessCookies';
import Router from 'next/router'
import { businessRoute } from '../routes';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {

    graphQLErrors.forEach(({ message, locations, path, originalError, }) => {
      console.log(
        `[GraphQL error] Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    });

    for (let err of graphQLErrors) {
      if (err.extensions?.httpStatus === 'Unauthorized' && err.extensions?.app === 'business') {
        clearCookies()
        Router.push(businessRoute.login)
      }

      if (err.extensions?.httpStatus === 'Unauthorized' && err.extensions?.app === 'client') {
        clearClientCookies()
      }

      console.log("code", err.extensions?.code)
      console.log("cause", err.extensions?.cause)
      console.log("httpStatus", err.extensions?.httpStatus)
    }


  }
  if (networkError) console.log(`[Network error]: ${networkError}`);

  //TODO: if graphQL error has something about authentication, then logout
});

const httpLink = createUploadLink({
  uri: process.env.BACKEND_URL,
})

// todo change on Doppler

// make sure websocket is null if window not defined

const wsLink = typeof window === 'undefined' ? null : new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql' || process.env.BACKEND_URL,
}));



const authLink = setContext((_: any, { headers }) => {
  const token = getCookies("token")
  const clientToken = getClientCookies("token")

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'clientauthorization': clientToken ? `Bearer ${clientToken}` : "",
      'Apollo-Require-Preflight': 'true',
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY
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
});

export { client }



