import Models from 'Models';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class EventsResolver extends BaseConnectionResolver {
  entity = Models.CalendarEvent;

  query = () => {
    const Op = Models.Sequelize.Op;
    const where = {};
    const include = [];

    if (this.args.types?.length) {
      where.type = { [Op.in]: this.args.types };
    }

    if (this.args.attendee_ids?.length) {
      include.push({
        model: Models.User,
        as: 'invites',
        attributes: ['id'],
        through: {
          attributes: ['id'],
          where: {
            user_id: {
              [Op.in]: this.args.attendee_ids,
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
