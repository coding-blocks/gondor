import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from 'Graphql/generated/resolvers';
import typeDefs from 'Graphql/generated/types.graphql';

export default makeExecutableSchema({
  resolvers,
  typeDefs: gql`
    ${typeDefs}
  `,
});
