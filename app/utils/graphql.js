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

export const combineErrors = (...errors) =>
  errors.reduce((_errors, err) => {
    if (!err) return _errors;

    errors = _errors || {};

    Object.keys(err).map(key => {
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

export const map = (data, path, cb) => {
  const destination = path
    .split('.')
    .reduce((des, key) => data && data[key], data);

  if (destination?.edges) return destination.edges.map(({ node }) => cb(node));

  return [];
};
