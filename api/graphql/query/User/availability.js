const availability = async (parent, { dateTimeRange }, { loaders }) =>
  loaders.userAvailabilityLoader.load({
    user_id: parent.id,
    dateTimeRange,
    exculdeEvents: [],
  });

export default availability;
