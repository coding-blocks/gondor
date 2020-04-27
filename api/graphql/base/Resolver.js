class BaseResolver {
  constructor(parent, args, ctx, info) {
    this.parent = parent;
    this.args = args;
    this.ctx = ctx;
    this.info = info;
  }

  resolve = () => null;
}

BaseResolver.resolver = function () {
  return async function () {
    try {
      const handler = new this(...arguments);
      if (typeof handler.validate === 'function') {
        await handler.validate();
      }
      return await handler.resolve();
    } catch (err) {
      console.log(err);

      throw err;
    }
  }.bind(this);
};

export default BaseResolver;
