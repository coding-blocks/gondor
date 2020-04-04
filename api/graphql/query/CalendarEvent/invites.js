import Models from 'Models';

const invites = parent =>
  Models.CalendarEventInvite.findAll({ where: { event_id: parent.id } });

export default invites;
