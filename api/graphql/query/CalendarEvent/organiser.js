import Models from 'Models';

const organiser = parent => Models.User.findByPk(parent.organiser_id);

export default organiser;
