export const formatErrors = (errors) => {
  const error = errors?.graphQLErrors && errors.graphQLErrors[0];

  if (!error) return null;

  const fieldErrors = error.extensions?.validationErrors || [];

  return fieldErrors.reduce(
    (data, { field, error: message }) =>
      ((data[field] = message) || true) && data,
    { _message: error.message },
  );
};

export const combineErrors = (...errors) =>
  errors.reduce((_errors, err) => {
    if (!err) return _errors;

    errors = _errors || {};

    Object.keys(err).map((key) => {
      if (errors[key] && Array.isArray(errors[key])) errors[key].push(err.key);
      else if (errors[key]) errors[key] = [errors[key], err[key]];
      else errors[key] = err[key];
    });

    return errors;
  }, null);

export const extractNodes = (data, path) => {
  const destination = path
    .split('.')
    .reduce((des, key) => data && data[key], data);

  if (destination?.edges) return destination.edges.map(({ node }) => node);

  return [];
};

export const get = (data, path) =>
  path.split('.').reduce((des, key) => des && des[key], data);

export const set = (data, path, value) => {
  const keys = path.split('.');

  const base = keys
    .slice(0, keys.length - 1)
    .reduce((des, key) => data && data[key], data);

  if (base) base[keys[keys.length - 1]] = value;

  return data;
};

export const map = (data, path, cb) => {
  const destination = get(data, path);

  if (destination?.edges) return destination.edges.map(({ node }) => cb(node));

  return [];
};

export const removeFromCache = ({
  query,
  variables,
  connectionPath,
  nodePath,
}) => (client, { data }) => {
  const cache = client.readQuery({ query, variables });
  const connection = get(cache, connectionPath);
  const node = get(data, nodePath);

  client.writeQuery({
    query,
    variables,
    data: set(
      cache,
      connectionPath,
      connection.filter(({ id }) => id !== node?.id),
    ),
  });
};

export const pushToCache = ({ query, variables, connectionPath, nodePath }) => (
  client,
  { data },
) => {
  const cache = client.readQuery({ query, variables });
  const connection = get(cache, connectionPath);
  const node = get(data, nodePath);

  client.writeQuery({
    query,
    variables,
    data: set(cache, connectionPath, [...connection, node]),
  });
};

export const extractMap = (
  obj = [],
  { key = '', label = 'label', value = 'value' } = {
    key: '',
    label: 'label',
    value: 'value',
  },
) =>
  (!!key ? obj[key] : obj).reduce(
    (m, item) => ((m[get(item, label)] = get(item, value)) || true) && m,
    {},
  );
