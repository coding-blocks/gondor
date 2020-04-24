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
  return function () {
    return new this(...arguments).resolve();
  }.bind(this);
};

export default BaseResolver;
