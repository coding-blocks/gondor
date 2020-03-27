import fs from 'fs';
import path from 'path';
import { loadGraphqlFile, getDirContents, isCamelCase, basename } from './utils';

// NOTE(naman): impure function
const loadDirectives = (state, root) => {
  root = path.join(root, 'directives');

  fs.readdirSync(root, {
    withFileTypes: true,
  }).map(dirent => insertIntoSchema(state, root, dirent));

  state.typeDefs.push(loadGraphqlFile(path.join(root, 'type.graphql')));
};

const insertIntoSchema = (state, root, dirent) => {
  if (dirent.name === 'type.graphql') return;

  if (dirent.isFile() && validateDirectiveName(dirent.name))
    return (state.directives[basename(dirent.name)] = path.join(root, dirent.name));
};

const validateDirectiveName = name => isCamelCase(basename(name)) && path.extname(name) === '.js';

export default loadDirectives;
