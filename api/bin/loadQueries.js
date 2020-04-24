import fs from 'fs';
import path from 'path';
import gql from 'graphql-tag';
import {
  loadGraphqlFile,
  getDirContents,
  isCamelCase,
  isPascalCase,
  basename,
} from './utils';

// NOTE(naman): impure function
const loadQueries = (state, root) => {
  state.resolvers.Query = {};
  root = path.join(root, 'query');

  fs.readdirSync(root, {
    withFileTypes: true,
  }).map((dirent) => insertIntoSchema(state, root, dirent));

  state.typeDefs.push(loadGraphqlFile(path.join(root, 'type.graphql')));
};

const insertIntoSchema = (state, root, dirent) => {
  try {
    if (dirent.name === 'type.graphql') return;

    if (dirent.isFile() && validateFieldName(dirent.name))
      return buildRootQueryField(state, root, dirent);

    if (dirent.isDirectory() && validateTypeName(dirent.name))
      return buildType(state, root, dirent);
  } catch (err) {
    console.log(err);
  }
};

const buildRootQueryField = (state, root, dirent) =>
  (state.resolvers.Query[basename(dirent.name)] = path.join(root, dirent.name));

const buildType = (state, root, dirent) => {
  const type = dirent.name;
  const contents = getDirContents(path.join(root, dirent.name));

  Object.keys(contents).forEach((filename) => {
    try {
      const content = contents[filename];

      if (filename === 'type.graphql') return state.typeDefs.push(content);

      if (validateFieldName(filename)) {
        const resolver = state.resolvers[type] || {};
        resolver[basename(filename)] = content;
        state.resolvers[type] = resolver;
      }
    } catch (err) {
      console.log(err);
    }
  });
};

const validateFieldName = (name) =>
  path.extname(name) === '.js' && isCamelCase(basename(name));

const validateTypeName = (name) => isPascalCase(basename(name));

export default loadQueries;
