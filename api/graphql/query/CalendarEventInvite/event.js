import Models from 'Models';

const event = (parent) => Models.CalendarEvent.findByPk(parent.event_id);

export default event;
