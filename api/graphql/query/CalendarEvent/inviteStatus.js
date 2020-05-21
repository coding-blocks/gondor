import Models from 'Models';

const inviteStatus = async (parent, _args, { viewer }) => {
  if (!viewer) return null;

  const invite = await Models.CalendarEventInvite.findOne({
    where: { event_id: parent.id, user_id: viewer.id },
  });

  return invite?.status;
};

export default inviteStatus;
