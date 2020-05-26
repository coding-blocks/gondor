import BaseResolver from './Resolver';
import { UserInputError } from 'apollo-server-micro';

class EntityResolver extends BaseResolver {
  resolve = async () =>
    this.model
      .findOne({
        where: { id: Number(this.args.id), slug: String(this.args.slug) },
        ...((await this.query?.call(this)) || {}),
      })
      .then(console.log(this.args))
      .catch((err) => {
        throw new UserInputError(err);
      });
}

export default EntityResolver;
