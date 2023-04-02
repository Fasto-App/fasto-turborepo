import { onError } from "@apollo/client/link/error";
import Router from "next/router";
import { clearCookies, clearClientCookies } from "../cookies/businessCookies";
import { businessRoute } from "../routes";

export const errorLink = onError(({ graphQLErrors, networkError }) => {
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