import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

let globalApolloClient = null;

const createApolloClient = (ctx = {}, initialState = {}) => {
  const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache().restore(initialState);

  return new ApolloClient({
    ssrMode,
    link: createIsomorphLink(ctx),
    cache,
  });
};

const createIsomorphLink = ctx => {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('apollo-link-schema');
    const schema = require('Api/graphql/schema');
    return new SchemaLink({ schema, context: ctx });
  } else {
    const { HttpLink } = require('apollo-link-http');

    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
};

export const initApolloClient = (ctx, initialState) => {
  if (typeof window === 'undefined') {
    return createApolloClient(ctx, initialState);
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(ctx, initialState);
  }

  return globalApolloClient;
};
