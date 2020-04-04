import Models from 'Models';
import Policy from 'Services/AuthorizationPolicy';

const invites = async (parent, _args, ctx) => {
  const query = {
    where: { event_id: parent.id },
  };

  if (
    !(await Policy.can(ctx.viewer)
      .perform('requests:read')
      .on(parent, 'calendarEvent'))
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
