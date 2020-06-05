import Models from 'Models';
import BaseLoader from 'Services/BaseModelService/Loader';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';

export default class Availability extends BaseLoader {
  load = async () => {
    const invites = await Models.CalendarEventInvite.scope('visible').findAll({
      include: [
        {
          model: Models.CalendarEvent,
          as: 'event',
          where: {
            [Models.Sequelize.Op.or]: this.keys.map(
              ({ user_id, dateTimeRange, excludeEvents = [] }) => ({
                [Models.Sequelize.Op.and]: [
                  {
                    $user_id$: user_id,
                  },
                  {
                    id: {
                      [Models.Sequelize.Op.notIn]: excludeEvents,
                    },
                  },
                  overlapDateTimeClause(dateTimeRange),
                ],
              }),
            ),
          },
          required: true,
        },
      ],
    });

    return this.keys.map(
      (key) => !invites.find((invite) => this.equateKeyAndInvite(key, invite)),
    );
  };

  equateKeyAndInvite({ user_id, excludedEvents = [], dateTimeRange }, invite) {
    if (invite.user_id !== user_id || excludedEvents.includes(invite.event.id))
      return false;

    if (
      new Date(invite.event.start_at) > new Date(dateTimeRange.end_at) ||
      new Date(invite.event.end_at) < new Date(dateTimeRange.start_at)
    )
      return false;

    return true;
  }
}
