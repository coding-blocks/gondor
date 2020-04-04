import Models from 'Models';

const user = parent => Models.User.findByPk(parent.user_id);

export default user;
