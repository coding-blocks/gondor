import Models from 'Models';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class UsersResolver extends BaseConnectionResolver {
  model = Models.User;

  query = () => {
    const where = {};
    const Op = Models.Sequelize.Op;
    const { roles, search } = this.args;

    if (roles) where.role = { [Op.in]: roles };

    if (search?.length)
      where[Op.or] = [
        { username: { [Op.iLike]: `${search}%` } },
        { email: { [Op.iLike]: `${search}%` } },
        { firstname: { [Op.iLike]: `${search.split(' ')[0]}%` } },
        {
          lastname: {
            [Op.iLike]: `${search.split(' ')[1] || search.split(' ')[0]}%`,
          },
        },
      ];

    return { where };
  };
}

export default UsersResolver.resolver();
