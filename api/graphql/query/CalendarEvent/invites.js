import Models from 'Models';
import AuthPolicy from 'Services/AuthorizationPolicy';

const invites = async (parent, _args, ctx) => {
  const Op = Models.Sequelize.Op;
  const query = {
    where: { event_id: parent.id },
  };

  if (
    await AuthPolicy.can(ctx.viewer)
      .perform('calendarEvent:requests:read')
      .on(parent)
  ) {
    query.where[Op.or] = [
      {
        status: { [Op.not]: 'Refused' },
      },
      { user_id: ctx.viewer.id },
    ];
  } else {
    const options = [
      {
        status: { [Op.not]: ['Requested', 'Refused'] },
      },
    ];

    if (ctx.viewer) options.push({ user_id: ctx.viewer.id });

    query.where[Op.or] = options;
  }

  return Models.CalendarEventInvite.findAll(query);
};

export default invites;
