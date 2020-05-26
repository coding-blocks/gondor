import BaseResolver from './Resolver';
import Models from 'Models';

class EntityResolver extends BaseResolver {
  resolve = async () => {
    const Op = Models.Sequelize.Op;
    let where = { id: Number(this.args.id) };

    if (this.model.rawAttributes.hasOwnProperty('slug')) {
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
