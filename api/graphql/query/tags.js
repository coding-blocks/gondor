import Models from 'Models';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class TagsResolver extends BaseConnectionResolver {
  model = Models.Tag;

  query = () => {
    const where = {};
    const Op = Models.Sequelize.Op;
    const { search } = this.args;

    if (search?.length) {
      return {
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `${search}%` } },
            { code: { [Op.iLike]: `${search}%` } },
          ],
        },
      };
    }

    return {};
  };
}

export default TagsResolver.resolver();
