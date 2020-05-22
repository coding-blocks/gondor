const inviteStatus = async (parent, _args, { viewer, loaders }) => {
  if (!viewer) return null;

  const invite = await loaders.calenderEventInviteLoader.load({
    where: { event_id: parent.id, user_id: viewer.id },
  });

  return invite?.status;
};

export default inviteStatus;
