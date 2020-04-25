import BaseResolver from './Resolver';

class EntityResolver extends BaseResolver {
  resolve = async () =>
    this.model.findOne({
      where: { id: Number(this.args.id) },
      ...((await this.query?.call(this)) || {}),
    });
}

export default EntityResolver;
