import Policy from 'auth-policy';
import { isUser, isMember, isAdmin, isSelf, isOrganiser } from './utils';

const policy = new Policy();

policy.include('query', (p) => {
  p.include('user', (cp) =>
    cp.register('read', ({ viewer }) => isMember(viewer)),
  );

  p.include('events', (cp) =>
    cp.register('read', ({ viewer }) => isMember(viewer)),
  );

  p.include('zoomAccounts', (cp) =>
    cp.register('read', ({ viewer }) => isAdmin(viewer)),
  );
});

policy.include('features', (p) => {
  p.register('teamManagement', ({ viewer }) => isMember(viewer));
  p.register('calendar', ({ viewer }) => isUser(viewer));
  p.register('settings', ({ viewer }) => isAdmin(viewer));
});

policy.include('user', (p) => {
  p.register('impersonate', ({ viewer }) => isAdmin(viewer));
  p.register('read', ({ viewer }) => isUser(viewer));
  p.register(
    'update',
    ({ viewer, entity: user }) => isSelf(user, viewer) || isAdmin(viewer),
  );

  p.include(['email', 'mobile_number', 'photo'], (cp) => {
    cp.register(
      'read',
      ({ viewer, entity: user }) => isSelf(user, viewer) || isMember(viewer),
    );
    cp.register(
      'update',
      ({ viewer, entity: user }) => isSelf(user, viewer) || isAdmin(viewer),
    );
  });

  p.include('role', (cp) => {
    cp.register(
      'read',
      ({ viewer, entity: user }) => isSelf(user, viewer) || isMember(viewer),
    );
    cp.register('update', ({ viewer }) => isAdmin(viewer));
  });

  p.include('events', (cp) => {
    cp.register(
      'read',
      ({ viewer, entity: user }) => isSelf(user, viewer) || isMember(viewer),
    );
  });

  p.include('availability', (cp) => {
    cp.register(
      'read',
      ({ viewer, entity: user }) => isSelf(user, viewer) || isMember(viewer),
    );
  });
});

policy.include('calendarEvent', (p) => {
  p.register('create', ({ viewer }) => isMember(viewer));
  p.register(
    ['update', 'delete'],
    ({ viewer, entity: event }) =>
      isOrganiser(event, viewer) || isAdmin(viewer),
  );

  p.include(
    [
      'title',
      'description',
      'start_at',
      'end_at',
      'location',
      'type',
      'is_open',
      'is_public',
      'slug',
    ],
    (cp) => {
      cp.register(
        'update',
        ({ viewer, entity: event }) =>
          isOrganiser(event, viewer) || isAdmin(viewer),
      );
    },
  );

  p.include('requests', (cp) => {
    cp.register(
      'read',
      ({ viewer, entity: event }) =>
        isOrganiser(event, viewer) || isAdmin(viewer),
    );
  });

  p.include('resources', (cp) => {
    cp.register(
      'read',
      ({ viewer, entity: event }) =>
        isOrganiser(event, viewer) || isMember(viewer),
    );
  });

  p.include('slug', (cp) => {
    cp.register('read', () => true);
  });
});

policy.include('calendarEventInvite', (p) => {
  p.register(
    ['create', 'delete'],
    ({ viewer, entity: { event, status }, action }) =>
      isOrganiser(event, viewer) ||
      isAdmin(viewer) ||
      (isUser(viewer) && status === 'Requested' && action === ':create'),
  );
  p.register(
    'update',
    ({ viewer, entity: { user_id, event } }) =>
      isSelf({ id: user_id }, viewer) || isOrganiser(event, viewer),
  );

  p.include(['entity', 'user'], (cp) => {
    cp.register('update', () => false);
  });

  p.include('status', (cp) => {
    cp.register(
      'update',
      ({ viewer, entity: { user_id, event, status, value } }) => {
        const requested = ['Requested', 'Refused'].includes(status);

        if (value.status === 'Requested' && !event.is_open) return false;

        if (!requested) return isSelf({ id: user_id }, viewer);

        if (requested) return isOrganiser(event, viewer);
      },
    );
  });
});

policy.include('zoomAccount', (p) => {
  p.register(['create', 'delete'], ({ viewer }) => isAdmin(viewer));

  p.include(['uses', 'availability'], (cp) =>
    cp.register('read', ({ viewer }) => isMember(viewer)),
  );

  p.include('availability', (cp) =>
    cp.register('read', ({ viewer }) => isMember(viewer)),
  );
});

policy.include('resource', (p) => {
  p.register('create', ({ viewer, value: { topic_type, topic } }) => {
    if (topic_type === 'CalendarEvent') {
      return isOrganiser(topic, viewer) || isAdmin(viewer);
    }

    return false;
  });

  p.register('delete', ({ viewer, entity: { topic_type, topic } }) => {
    if (topic_type === 'CalendarEvent') {
      return isOrganiser(topic, viewer) || isAdmin(viewer);
    }

    return false;
  });

  p.include('availability', (cp) =>
    cp.register('read', ({ viewer }) => isMember(viewer)),
  );
});

export default policy;
