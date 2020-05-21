import Models from 'Models';

const availability = async (parent, _args, { loaders }) => {
  const event = await Models.CalendarEvent.findByPk(parent.event_id);

  return loaders.userAvailabilityLoader.load({
    user_id: parent.user_id,
    dateTimeRange: { start_at: event.start_at, end_at: event.end_at },
    exculdeEvents: [event.id],
  });
};

export default availability;
