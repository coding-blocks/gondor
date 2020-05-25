export const isAdmin = (viewer) => viewer?.role === 'Admin';

export const isMember = (viewer) => ['Admin', 'Member'].includes(viewer?.role);

export const isUser = (viewer) =>
  ['Admin', 'Member', 'User'].includes(viewer?.role);

export const isSelf = (user, viewer) => user?.id == viewer?.id;

export const isOrganiser = (event, viewer) => event?.organiser_id == viewer?.id;

export const isPublicEvent = (event) => event?.is_public === true;
