export const formatErrors = errors => {
  const error = errors?.graphQLErrors && errors.graphQLErrors[0];

  if (!error) return null;

  const fieldErrors = error.extensions?.validationErrors || [];

  return fieldErrors.reduce(
    (data, { field, error: message }) =>
      ((data[field] = message) || true) && data,
    { _message: error.message },
  );
};

export const extractNodes = (data, path) => {
  const destination = path
    .split('.')
    .reduce((des, key) => data && data[key], data);

  if (destination?.edges) return destination.edges.map(({ node }) => node);

  return [];
};

export const map = (data, path, cb) => {
  const destination = path
    .split('.')
    .reduce((des, key) => data && data[key], data);

  if (destination?.edges) return destination.edges.map(({ node }) => cb(node));

  return [];
};
