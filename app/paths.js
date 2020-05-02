export default {
  me: {
    calendar: () => ['/me/calendar'],
  },
  users: {
    calendar: ({ id }) => ['/users/[userId]/calendar', `/users/${id}/calendar`],
  },
};
