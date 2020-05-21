import schema from 'Graphql/schema';
import connect from 'Utils/connect';
import cookieParser from 'micro-cookie';
import { ApolloServer } from 'apollo-server-micro';
import authenticate from 'Middlewares/authenticate';
import User from 'Services/User';

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    viewer: req.viewer,
    loaders: { userAvailabilityLoader: User.getAvailabilityLoader() },
  }),
});

export const config = { api: { bodyParser: false } };

export default connect(
  cookieParser,
  authenticate,
  server.createHandler({ path: '/api/graphql' }),
);
