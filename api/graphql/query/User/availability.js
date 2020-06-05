const availability = async (parent, { dateTimeRange }, { loaders }) =>
  loaders.userAvailability.load({
    user_id: parent.id,
    dateTimeRange,
    excludeEvent: [],
  });

export default availability;
