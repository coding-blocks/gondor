import UserRole from 'Services/UserRole';

const roles = parent => UserRole.findNamesForUser(parent);

export default roles;
