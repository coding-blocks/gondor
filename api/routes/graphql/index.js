import { resolvers, typeDefs } from 'Graphql';
import { ApolloServer } from 'apollo-server-micro';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    // TODO(naman): Integrate auth middleware
    viewer: null,
  }),
});

export const config = { api: { bodyParser: false } };

export default server.createHandler({ path: '/api/graphql' });
