export default (...decorators) => (value) =>
  decorators.reverse().reduce((result, decorator) => decorator(result), value);
