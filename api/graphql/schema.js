import gql from 'graphql-tag';
import GraphQLDateTime from 'graphql-type-datetime';
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './_generated/resolvers';
import typeDefs from './_generated/types.graphql';
// NOTE(naman): import not working
const schemaDirectives = require('./_generated/directives').default;

export default makeExecutableSchema({
  resolvers: { ...resolvers, DateTime: GraphQLDateTime },
  typeDefs: gql`
    ${typeDefs}
  `,
  schemaDirectives,
  uploads: false,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});
