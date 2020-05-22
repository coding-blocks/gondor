const inviteStatus = async (parent, _args, { viewer, loaders }) => {
  if (!viewer) return null;

  return await loaders.viewerCalendarEventInviteStatus.load({
    event_id: parent.id,
    viewer,
  });
};

export default inviteStatus;
