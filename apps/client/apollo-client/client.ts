import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context';
import { getClientCookies, getCookies } from '../cookies/businessCookies';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { errorLink } from './ErrorLink';

const httpLink = createUploadLink({
  uri: process.env.BACKEND_URL,
})

const params = () => {
  const token = getCookies("token")
  const clientToken = getClientCookies("token")

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
    url: 'ws://localhost:4000/graphql' || process.env.BACKEND_URL,
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
});

export { client }



