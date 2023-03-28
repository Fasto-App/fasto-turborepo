import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { clearClientCookies, clearCookies, getClientCookies, getCookies } from '../cookies/businessCookies';
import Router from 'next/router'
import { businessRoute, clientRoute } from '../routes';

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
  uri: "http://192.168.15.46:4000/graphql",
})


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


const client = new ApolloClient({
  // @ts-ignore
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

export { client }



