import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import config from 'Config';

let globalApolloClient = null;

const createApolloClient = (ctx = {}, initialState = {}) => {
  const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache().restore(initialState);

  return new ApolloClient({
    ssrMode,
    link: createIsomorphLink(ctx),
    cache,
    credentials: 'include',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: { fetchPolicy: 'cache-and-network' },
    },
  });
};

const createIsomorphLink = (ctx) => {
  const ssrMode = typeof window === 'undefined';
  const { HttpLink } = require('apollo-link-http');

  return new HttpLink({
    uri: ssrMode
      ? 'http://localhost:3000/api/graphql'
      : config.app.url + '/api/graphql',
    credentials: 'same-origin',
    fetch: require('node-fetch'),
    headers: {
      cookie: ctx.req ? ctx.req.headers.cookie : undefined,
    },
  });
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
