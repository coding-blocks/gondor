import BaseResolver from './Resolver';
import Models from 'Models';
import { UserInputError } from 'apollo-server';

class EntityResolver extends BaseResolver {
  resolve = async () => {
    const Op = Models.Sequelize.Op;
    let where = { id: Number(this.args.id) };

    if (this.model.rawAttributes.hasOwnProperty('slug')) {
      if ((this.args.id === this.args.slug) === undefined)
        throw new UserInputError('Not a valid id or slug');

      if (isNaN(Number(this.args.id))) {
        where = { slug: this.args.slug };
      } else if (this.args.slug !== undefined)
        where = {
          [Op.or]: [{ id: Number(this.args.id) }, { slug: this.args.slug }],
        };
    }

    return await this.model.findOne({
      where: where,
      ...((await this.query?.call(this)) || {}),
    });
  };
}

export default EntityResolver;
