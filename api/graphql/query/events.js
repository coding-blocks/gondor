import Models from 'Models';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';
import moment from 'moment';
import { UserInputError } from 'apollo-server-micro';

class EventsResolver extends BaseConnectionResolver {
  model = Models.CalendarEvent;

  MAX_LIMIT = null;

  validate = () => {
    const {
      dateTimeRange: { start_at, end_at },
    } = this.args;
    const startDate = moment(start_at);
    const endDate = moment(end_at);
    const range = Math.abs(startDate.diff(endDate, 'days')) + 1;

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

  query = () => {
    const Op = Models.Sequelize.Op;
    const where = {};
    const include = [];

    if (this.args.types?.length) {
      where.type = { [Op.in]: this.args.types };
    }

    if (this.args.attendees?.length) {
      include.push({
        model: Models.User,
        as: 'attendees',
        attributes: ['id'],
        through: {
          attributes: ['id'],
          where: {
            user_id: {
              [Op.in]: this.args.attendees,
            },
            status: {
              [Op.in]: ['Pending', 'Accepted', 'Requested'],
            },
          },
        },
        required: true,
      });
    }

    const query = {
      order: 'start_at',
      where: {
        [Op.and]: [overlapDateTimeClause(this.args.dateTimeRange), where],
      },
      include,
    };

    return query;
  };
}

export default EventsResolver.resolver();
