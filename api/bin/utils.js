import fs from 'fs';
import path from 'path';
import camelcase from 'camelcase';
import pascalcase from 'pascalcase';

export const loadGraphqlFile = p => fs.readFileSync(p, { encoding: 'utf8' });

export const getDirContents = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).reduce((contents, dirent) => {
    const contentPath = path.join(dir, dirent.name);

    if (dirent.isFile()) {
      const ext = path.extname(dirent.name);

      switch (ext) {
        case '.js':
          contents[dirent.name] = contentPath;
          break;
        case '.graphql':
          contents[dirent.name] = loadGraphqlFile(contentPath);
          break;
      }
    }

    return contents;
  }, {});

const convertMapToString = map =>
  `{
    ${Object.keys(map).reduce(
      (str, key) => `${str}
        ${key}: ${typeof map[key] === 'string' ? `require('${map[key]}').default` : convertMapToString(map[key])},
      `,
      ``,
    )}
  }`;

export const transformMap = map => `export default ${convertMapToString(map).replace(/\s/g, '')}`;

export const transformTypeDefs = typeDefs => typeDefs.join('\n').replace(/(\r\n|\r|\n){2,}/g, '$1\n');

export const isCamelCase = str => str === camelcase(str);

export const isPascalCase = str => str === pascalcase(str);

export const basename = (name, ext) => path.basename(name, ext || path.extname(name));
