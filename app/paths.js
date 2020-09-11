export default {
  me: {
    calendar: () => ['/me/calendar'],
  },
  users: {
    calendar: ({ id }) => ['/users/[userId]/calendar', `/users/${id}/calendar`],
  },
  events: {
    calendar: ({ slug }) => ['/events/[id_or_slug]', `/events/${slug}`],
  },
  tags: {
    calendar: ({ slug }) => ['/t/[tagSlug]', `/t/${slug}`],
  },
  planner: {
    index: () => ['/planner'],
  },
};
