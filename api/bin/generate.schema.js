import fs from 'fs';
import path from 'path';
import gql from 'graphql-tag';
import camelcase from 'camelcase';
import pascalcase from 'pascalcase';

const resolvers = { Query: {} };
const rootDir = path.resolve(__dirname, '../graphql');
const typeDefs = [
  fs.readFileSync(path.join(rootDir, 'query/type.graphql'), {
    encoding: 'utf8',
  }),
  fs.readFileSync(path.join(rootDir, 'mutation/type.graphql'), {
    encoding: 'utf8',
  }),
];

const generate = () =>
  Promise.all(
    ['query', 'mutation'].map(base =>
      Promise.all(
        fs
          .readdirSync(path.join(rootDir, base), {
            withFileTypes: true,
          })
          .map(dirent => insertIntoSchema(base, dirent)),
      ),
    ),
  );

const insertIntoSchema = (base, dirent) => {
  if (dirent.name === 'type.graphql') return;

  if (dirent.isFile() && validateFieldName(dirent.name))
    return buildField(base, dirent);

  if ((dirent.isDirectory(), validateTypeName(dirent.name)))
    return buildType(base, dirent);
};

const buildField = async (base, dirent) =>
  (resolvers[pascalcase(base)][basename(dirent.name)] = await ensureFile(
    path.join(rootDir, base, dirent.name),
  ));

const buildType = async (base, dirent) => {
  const type = dirent.name;
  const contents = await getDirContents(path.join(rootDir, base, dirent.name));

  Object.keys(contents).forEach(filename => {
    const content = contents[filename];

    if (filename === 'type.graphql') return typeDefs.push(content);

    if (validateFieldName(filename)) {
      const resolver = resolvers[type] || {};
      resolver[basename(filename)] = content;
      resolvers[type] = resolver;
    }
  });
};

const getDirContents = dir =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .reduce(async (contentsPromise, dirent) => {
      const contents = await contentsPromise;
      const contentPath = path.join(dir, dirent.name);

      if (dirent.isFile()) {
        const ext = path.extname(dirent.name);

        switch (ext) {
          case '.js':
            contents[dirent.name] = await ensureFile(contentPath);
            break;
          case '.graphql':
            contents[dirent.name] = fs.readFileSync(contentPath, {
              encoding: 'utf8',
            });

            break;
        }
      }

      return contents;
    }, Promise.resolve({}));

const ensureFile = filePath => filePath;

/*
  new Promise(resolve =>
    require.ensure([filePath], require => resolve(require(filePath).default)),
  );
  */

const isCamelCase = str => str === camelcase(str);

const isPascalCase = str => str === pascalcase(str);

const validateFieldName = name =>
  path.extname(name) === '.js' && isCamelCase(basename(name))
    ? true
    : throw new Error(
        `${name} is not camelcase. convert it to ${camelcase(
          basename(name),
        )}${path.extname(name)}`,
      );

const validateTypeName = name =>
  isPascalCase(basename(name))
    ? true
    : throw new Error(
        `${name} is not pascalcase. convert it to ${pascalcase(
          basename(name),
        )}${path.extname(name)}`,
      );

const basename = (name, ext) => path.basename(name, ext || path.extname(name));

const generateSchema = async () =>
  new Promise(async resolve => {
    await generate();

    resolve({ resolvers, typeDefs });
  });

const convertResolverToString = resolver =>
  `{
    ${Object.keys(resolver).reduce(
      (str, key) => `${str}
        ${key}: ${
        typeof resolver[key] === 'string'
          ? `require('${resolver[key]}')`
          : convertResolverToString(resolver[key])
      },
      `,
      ``,
    )}
  }`;

generateSchema().then(({ resolvers, typeDefs }) => {
  const generatedResolver = `export default ${convertResolverToString(
    resolvers,
  ).replace(/\s/g, '')}`;

  const generatedTypeDefs = typeDefs
    .join('\n')
    .replace(/(\r\n|\r|\n){2,}/g, '$1\n');

  fs.writeFileSync(
    path.resolve(__dirname, '../graphql/generated/resolvers.js'),
    generatedResolver,
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../graphql/generated/types.graphql'),
    generatedTypeDefs,
  );
});
