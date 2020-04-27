import User from 'Services/User';
import Models from 'Models';

const availability = async (parent) => {
  const event = await Models.CalendarEvent.findByPk(parent.event_id);

  return User.findAvailaibilityDuring(
    parent.user_id,
    { start_at: event.start_at, end_at: event.end_at },
    [event.id],
  );
};

export default availability;
