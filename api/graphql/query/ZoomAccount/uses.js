import Models from 'Models';

const uses = (parent) =>
  Models.Resource.findAll({
    where: { subject_type: 'ZoomAccount', subject_id: parent.id },
  });

export default uses;
