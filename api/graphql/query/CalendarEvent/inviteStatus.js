const inviteStatus = async (parent, args, { viewer, loaders }) => {
  if (!viewer) return null;

  return await loaders.eventInviteStatus.load({
    event_id: parent.id,
    user_id: args.user || viewer.id,
  });
};

export default inviteStatus;
