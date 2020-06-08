import Models from 'Models';
import BaseLoader from 'Services/BaseModelService/Loader';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';

export default class Availability extends BaseLoader {
  load = async () => {
    const accounts = await Models.ZoomAccount.findAll({
      include: [
        {
          model: Models.Resource,
          as: 'uses',
          include: [
            {
              model: Models.CalendarEvent,
              as: 'calendarEvent',
              where: {
                [Models.Sequelize.Op.or]: this.keys.map(
                  ({ id, dateTimeRange, excludeEvents = [] }) => ({
                    [Models.Sequelize.Op.and]: [
                      overlapDateTimeClause(dateTimeRange),
                      {
                        '$zoom_account.id$': id,
                      },
                      {
                        id: {
                          [Models.Sequelize.Op.notIn]: excludeEvents,
                        },
                      },
                    ],
                  }),
                ),
              },
              required: true,
            },
          ],
          required: true,
        },
      ],
    });

    return this.keys.map(
      (key) =>
        !accounts.find((account) => this.equateKeyAndInvite(key, account)),
    );
  };

  equateKeyAndInvite({ id, excludedEvents = [], dateTimeRange }, account) {
    if (
      account.id !== id ||
      excludedEvents.includes(account['uses.calendarEvent.id'])
    )
      return false;

    if (
      new Date(account['uses.calendarEvent.start_at']) >
        new Date(dateTimeRange.end_at) ||
      new Date(account['uses.calendarEvent.end_at']) <
        new Date(dateTimeRange.start_at)
    )
      return false;

    return true;
  }
}
