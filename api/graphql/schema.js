import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './_generated/resolvers';
import typeDefs from './_generated/types.graphql';
import schemaDirectives from './_generated/directives';

export default makeExecutableSchema({
  resolvers,
  typeDefs: gql`
    ${typeDefs}
  `,
  schemaDirectives,
  uploads: false,
});
