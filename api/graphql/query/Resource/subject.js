import Models from 'Models';

const subjectResolver = async (parent) => {
  const subject = await Models.Resource.build(
    parent.dataValues || parent,
  ).getSubject();

  return { ...subject.toJSON(), __resolveType: parent.subject_type };
};

export default subjectResolver;
