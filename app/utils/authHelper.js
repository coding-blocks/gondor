export default {
  isAdmin: ({ user }) => user?.role === 'Admin',
  isMember: ({ user }) => ['Admin', 'Member'].includes(user?.role),
  isUser: ({ user }) => !!user,
};
