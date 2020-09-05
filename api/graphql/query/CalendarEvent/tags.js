import Models from 'Models';

const tags = (parent) =>
  Models.EventTag.findAll({
    where: { event_id: parent.id },
    include: [{ model: Models.Tag, as: 'tag' }],
  }).map(({ tag }) => tag);

export default tags;
