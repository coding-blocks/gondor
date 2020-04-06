import Models from 'Models';

const resources = parent =>
  Models.Resource.findAll({
    where: { topic_type: 'CalendarEvent', topic_id: parent.id },
  });

export default resources;
