import fs from 'fs';
import path from 'path';
import loadQueries from './loadQueries';
import loadMutations from './loadMutations';
import loadDirectives from './loadDirectives';
import { transformMap, transformTypeDefs } from './utils';

const state = {
    directives: {},
    resolvers: {},
    typeDefs: [],
  },
  root = path.resolve(__dirname, '../graphql');

loadQueries(state, root);
loadMutations(state, root);
loadDirectives(state, root);

fs.writeFileSync(
  path.resolve(__dirname, '../graphql/_generated/resolvers.js'),
  transformMap(state.resolvers),
);

fs.writeFileSync(
  path.resolve(__dirname, '../graphql/_generated/types.graphql'),
  transformTypeDefs(state.typeDefs),
);

fs.writeFileSync(
  path.resolve(__dirname, '../graphql/_generated/directives.js'),
  transformMap(state.directives),
);
