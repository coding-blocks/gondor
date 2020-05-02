import Models from 'Models';

const topicResolver = async (parent) => {
  const topic = await Models.Resource.build(
    parent.dataValues || parent,
  ).gettopic();

  return { ...topic.toJSON(), __typename: parent.topic_type };
};

export default topicResolver;
