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
            [Op.or]: [
              {
                status: {
                  [Op.in]: ['Pending', 'Accepted', 'Requested'],
                },
              },
              {
                status: 'Declined',
                user_id: this.ctx.viewer?.id,
              },
            ],
          },
        },
        required: true,
      });
    }

    if (this.args.tags?.length) {
      include.push({
        model: Models.Tag,
        as: 'tags',
        where: {
          attributes: ['id'],
          id: {
            [Op.id]: this.args.tags,
          },
        },
        required: true,
      });
    }

    if (this.args.tags?.length) {
      include.push({
        model: Models.Tag,
        as: 'tags',
        attributes: ['id'],
        through: {
          attributes: ['id'],
          where: {
            tag_id: {
              [Op.in]: this.args.tags,
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
