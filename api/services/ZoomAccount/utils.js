import Models from 'Models';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';

export const utilizedResourceClause = (
  dateTimeRange,
  { excludeTopics = [] } = { excludeTopics: [] },
) => ({
  include: [
    {
      model: Models.Resource,
      as: 'uses',
      include: [
        {
          model: Models.CalendarEvent,
          as: 'calendarEvent',
          where: {
            [Models.Sequelize.Op.and]: [
              overlapDateTimeClause(dateTimeRange),
              {
                id: {
                  [Models.Sequelize.Op.notIn]: excludeTopics,
                },
              },
            ],
          },
          required: true,
        },
      ],
      required: true,
    },
  ],
});
