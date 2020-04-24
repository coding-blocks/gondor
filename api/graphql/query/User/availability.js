import User from '../../../services/User';

const availability = (parent, { dateTimeRange }) =>
  User.findAvailaibilityDuring(parent.id, dateTimeRange);

export default availability;
