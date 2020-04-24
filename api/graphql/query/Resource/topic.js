import Models from 'Models';

const topicResolver = async (parent) => {
  const topic = await Models.Resource.build(
    parent.dataValues || parent,
  ).gettopic();

  return { ...topic.toJSON(), __resolveType: parent.topic_type };
};

export default topicResolver;
