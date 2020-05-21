import Models from 'Models';

const inviteStatus = async (parent, _args, ctx) => {
  if (!ctx.viewer) return null;

  const invite = await Models.CalendarEventInvite.findOne({
    where: { event_id: parent.id, user_id: ctx.viewer.id },
  });
  return invite?.status;
};

export default inviteStatus;
