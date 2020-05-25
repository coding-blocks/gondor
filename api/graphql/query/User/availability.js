const availability = async (parent, { dateTimeRange }, { loaders }) =>
  loaders.userAvailability.load({
    user_id: parent.id,
    dateTimeRange: {
      start_at: new Date(dateTimeRange.start_at),
      end_at: new Date(dateTimeRange.end_at),
    },
    excludeEvent: [],
  });

export default availability;
