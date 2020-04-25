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
      { user_id: ctx.viewer?.id, status: 'Refused' },
    ];
  } else {
    query.where[Op.or] = [
      {
        status: { [Op.not]: 'Requested' },
      },
      { user_id: ctx.viewer?.id },
    ];
  }

  return Models.CalendarEventInvite.findAll(query);
};

export default invites;
