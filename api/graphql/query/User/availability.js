const availability = async (parent, { dateTimeRange }, ctx) =>
  ctx.loaders.userAvailabilityLoader.load({
    user_id: parent.id,
    dateTimeRange,
    exculdeEvents: [],
  });

export default availability;
