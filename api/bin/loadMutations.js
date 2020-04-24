import fs from 'fs';
import path from 'path';
import {
  loadGraphqlFile,
  getDirContents,
  isCamelCase,
  basename,
} from './utils';

// NOTE(naman): impure function
const loadMutations = (state, root) => {
  state.resolvers.Mutation = {};
  root = path.join(root, 'mutation');

  fs.readdirSync(root, {
    withFileTypes: true,
  }).map((dirent) => insertIntoSchema(state, root, dirent));

  state.typeDefs.push(loadGraphqlFile(path.join(root, 'type.graphql')));
};

const insertIntoSchema = (state, root, dirent) => {
  if (dirent.name === 'type.graphql') return;

  if (dirent.isDirectory() && validateMutationName(dirent.name))
    return buildMutation(state, root, dirent);
};

const buildMutation = (state, root, dirent) => {
  const contents = getDirContents(path.join(root, dirent.name));

  Object.keys(contents).forEach((filename) => {
    const content = contents[filename];

    if (filename === 'type.graphql') return state.typeDefs.push(content);

    if (filename === 'index.js')
      return (state.resolvers.Mutation[basename(dirent.name)] = content);
  });
};

const validateMutationName = (name) => isCamelCase(basename(name));

export default loadMutations;
