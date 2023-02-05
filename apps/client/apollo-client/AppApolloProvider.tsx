import React from "react"
import { ApolloProvider } from '@apollo/client';
import { client } from './client';

export const AppApolloProvider: React.FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}