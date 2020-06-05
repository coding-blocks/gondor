const inviteStatus = async (parent, _args, { viewer, loaders }) => {
  if (!viewer) return null;

  return await loaders.eventInviteStatus.load({
    event_id: parent.id,
    user_id: viewer.id,
  });
};

export default inviteStatus;
