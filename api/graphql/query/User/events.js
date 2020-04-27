import Models from 'Models';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';
import moment from 'moment';
import { UserInputError } from 'apollo-server-micro';

class UserEventsResolver extends BaseConnectionResolver {
  model = Models.CalendarEvent;

  MAX_LIMIT = null;

  validate = () => {
    const {
      dateTimeRange: { start_at, end_at },
    } = this.args;
    const range = Math.abs(moment(start_at).diff(moment(end_at), 'days')) + 1;

    if (range > 42) {
      throw new UserInputError(
        'The dateTimeRange cannot be more than 42 days',
        {
          validationErrors: [
            {
              field: 'dateTimeRange',
              message: 'The dateTimeRange cannot be more than 42 days',
            },
          ],
        },
      );
    }
  };

  query = () => ({
    order: 'start_at',
    where: overlapDateTimeClause(this.args.dateTimeRange),
    include: [
      {
        model: Models.User,
        as: 'attendees',
        attributes: ['id'],
        through: {
          attributes: ['id'],
          where: {
            user_id: this.parent.id,
            status: {
              [Models.Sequelize.Op.in]: ['Pending', 'Accepted', 'Requested'],
            },
          },
        },
        required: true,
      },
    ],
  });
}

export default UserEventsResolver.resolver();
