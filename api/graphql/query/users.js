import Models from 'Models';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class UsersResolver extends BaseConnectionResolver {
  entity = Models.User;

  query = () => {
    const where = {};
    const Op = Models.Sequelize.Op;
    const { roles, search } = this.args;

    if (roles) where.role = { [Op.in]: roles };

    if (search?.length)
      where[Op.or] = [
        { username: { [Op.like]: `${search}%` } },
        { email: { [Op.like]: `${search}%` } },
        { firstname: { [Op.like]: `${search.split(' ')[0]}%` } },
        {
          lastname: {
            [Op.like]: `${search.split(' ')[1] || search.split(' ')[0]}%`,
          },
        },
      ];

    return { where };
  };
}

export default UsersResolver.resolver();
