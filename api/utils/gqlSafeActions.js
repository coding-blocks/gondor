import { ApolloError } from 'apollo-server-micro';

const gqlSafeActions = (actions, { error } = {}) =>
  Promise.all(
    actions.map(async action => {
      try {
        return await action;
      } catch (error) {
        return { error };
      }
    }),
  ).then(results => {
    const errors = results.filter(({ error }) => !!error);

    if (errors.length)
      throw new ApolloError(
        error || 'There was some error while processing the request.',
        'MULTIPLE_ERRORS',
        {
          errors: errors.map(({ error }) => error.extensions),
        },
      );

    return results;
  });

export default gqlSafeActions;
