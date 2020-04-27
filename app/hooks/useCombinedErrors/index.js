import { useMemo } from 'react';
import { combineErrors, formatErrors } from 'Utils/graphql';

const useCombinedErrors = (...errors) =>
  useMemo(
    () => combineErrors(...errors.map((err) => formatErrors(err))),
    errors,
  );

export default useCombinedErrors;
