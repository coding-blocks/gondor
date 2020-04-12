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
    credentials: 'include',
  });
};

const createIsomorphLink = ctx => {
  const { HttpLink } = require('apollo-link-http');

  return new HttpLink({
    uri: 'http://localhost:3000/api/graphql',
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
/*
  if (typeof window === 'undefined') {
    const schema = require('Api/graphql/schema').default;
    const { SchemaLink } = require('apollo-link-schema');
    return new SchemaLink({
      schema,
      context: async () => {
        ctx.req.cookies = require('cookie').parse(ctx.req.headers.cookie);
        console.log('cookies', ctx.req.cookies);
        await require('Api/middlewares/authenticate').default(ctx.req, ctx.res);

        console.log(ctx.req.viewer);

        return { viewer: ctx.req.viewer };
      },
    });
  } else {
  */
