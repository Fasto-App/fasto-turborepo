import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getCookies } from 'cookies-next';

const PROD_URL = "https://opentab-backend.herokuapp.com/graphql";
const STAG_URL = "https://fasto-api-dev.herokuapp.com/";
const DEV_URL = "http://localhost:4000/graphql";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const URL = process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? DEV_URL : PROD_URL;

const httpLink = createUploadLink({
  uri: URL,
});

const authLink = setContext((_: any, { headers }) => {
  const cookies = getCookies()
  const token = cookies["opentab-cookies-token"]
  const businessID = cookies["opentab-cookies-businessID"]
  console.log("process.env.NEXT_PUBLIC_ENVIRONMENT", process.env.NEXT_PUBLIC_ENVIRONMENT)

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



