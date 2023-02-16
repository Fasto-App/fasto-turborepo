import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getCookies } from 'cookies-next';
import { clearCookies } from '../cookies/businessCookies';
import Router from 'next/router'
import { businessRoute } from '../routes';

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {

    graphQLErrors.forEach(({ message, locations, path, originalError, }) => {
      console.log(
        `[GraphQL error] Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    });

    for (let err of graphQLErrors) {
      if (err.extensions?.httpStatus === 'Unauthorized') {
        clearCookies()
        Router.push(businessRoute.login)
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


const authLink = setContext((_: any, { headers }) => {
  const cookies = getCookies()
  const token = cookies["opentab-cookies-token"]
  const businessID = cookies["opentab-cookies-businessID"]

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      business: businessID ?? "",
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



