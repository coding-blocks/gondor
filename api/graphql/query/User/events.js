import Models from 'Models';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class UserEventsResolver extends BaseConnectionResolver {
  entity = Models.CalendarEvent;

  query = () => {
    const query = {
      include: [
        {
          model: Models.User,
          as: 'invites',
          attributes: ['id'],
          through: {
            attributes: ['id'],
            where: {
              user_id: this.parent.id,
              status: { [Models.Sequelize.Op.notIn]: ['Declined', 'Refused'] },
            },
          },
          required: true,
        },
      ],
    };

    if (this.args.dateTimeRange)
      query.where = overlapDateTimeClause(this.args.dateTimeRange);

    return query;
  };
}

export default UserEventsResolver.resolver();
