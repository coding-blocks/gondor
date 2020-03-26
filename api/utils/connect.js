const connect = (...middlewares) => (req, res) =>
  middlewares.reduce(async (prev, next) => {
    await prev;

    return next(req, res);
  }, Promise.resolve());

export default connect;
