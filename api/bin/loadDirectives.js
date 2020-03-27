import fs from 'fs';
import path from 'path';
import camelcase from 'camelcase';
import {
  loadGraphqlFile,
  getDirContents,
  isCamelCase,
  basename,
} from './utils';

// NOTE(naman): impure function
const loadDirectives = (state, root) => {
  root = path.join(root, 'directives');

  fs.readdirSync(root, {
    withFileTypes: true,
  }).map(dirent => insertIntoSchema(state, root, dirent));
};

const insertIntoSchema = (state, root, dirent) => {
  try {
    if (dirent.isFile() && validateDirectiveName(dirent.name))
      state.directives[basename(dirent.name)] = path.join(root, dirent.name);
  } catch (err) {
    console.log(err);
  }
};

const validateDirectiveName = name => {
  if (isCamelCase(basename(name)) && path.extname(name) === '.js') return true;

  throw new Error(
    `${name} is not camelcase. convert it to ${camelcase(
      basename(name),
    )}${path.extname(name)}`,
  );
};

export default loadDirectives;
