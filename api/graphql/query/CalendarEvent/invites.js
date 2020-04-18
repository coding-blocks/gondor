import Models from 'Models';
import AuthPolicy from 'Services/AuthorizationPolicy';

const invites = async (parent, _args, ctx) => {
  const query = {
    where: { event_id: parent.id },
  };

  if (
    !(await AuthPolicy.can(ctx.viewer)
      .perform('calendarEvent:requests:read')
      .on(parent))
  ) {
    const Op = Models.Sequelize.Op;

    query.where[Op.or] = [
      {
        status: { [Op.notIn]: ['Requested', 'Refused'] },
      },
      { user_id: ctx.viewer?.id },
    ];
  }

  return Models.CalendarEventInvite.findAll(query);
};

export default invites;
