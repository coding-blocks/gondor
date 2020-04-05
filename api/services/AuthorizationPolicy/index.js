import PolicyBuilder from './PolicyBuilder';
import { createPolicy as cp } from './EntityPolicy';

export default class AuthorizationPolicy extends PolicyBuilder {
  /* NOTE(naman): example
   * AuthorizationPolicy.can(viewer).perform('email:read').on(MyEntity, 'entity_name');
   * or
   * AuthorizationPolicy.can(viewer).perform('email:read').on(MyEntityInstance);
   */
  static can = viewer => ({
    perform: new AuthorizationPolicy(viewer).authorize,
  });

  /* NOTE(naman): example
   * AuthorizationPolicy.for(viewer).gather(MyEntity, 'entity_name').concerns;
   * or
   * AuthorizationPolicy.for(viewer).gather(MyEntityInstance).properties;
   */
  static for = viewer => ({
    gather: new AuthorizationPolicy(viewer).gather,
  });

  _query = cp(policy => {
    policy.include('events', p => p.register('read', () => this.isMember));
  });

  _features = cp(policy => {
    policy.register('teamManagement', () => this.isAdmin);
    policy.register('calendar', () => this.isMember);
  });

  _user = cp(policy => {
    policy.register('read', () => this.isUser);
    policy.register('update', user => this.isSelf(user) || this.isAdmin);

    policy.include(['email', 'mobile_number', 'photo'], p => {
      p.register('read', user => this.isSelf(user) || this.isMember);
      p.register('update', user => this.isSelf(user) || this.isAdmin);
    });

    policy.include('role', p => {
      p.register('read', user => this.isSelf(user) || this.isMember);
      p.register('update', user => this.isAdmin);
    });

    policy.include('events', p => {
      p.register('read', user => this.isSelf(user) || this.isMember);
    });
  });

  _calendarEvent = cp(policy => {
    const isOrganiser = ({ organiser_id } = {}) =>
      organiser_id == this.viewer?.id;

    policy.register('create', () => this.isMember);
    policy.register('update', event => isOrganiser(event) || this.isAdmin);

    policy.include(
      ['title', 'description', 'start_at', 'end_at', 'location', 'type'],
      p => {
        p.register('update', event => isOrganiser(event) || this.Admin);
      },
    );

    policy.include('requests', p => {
      p.register('read', event => isOrganiser(event) || this.isAdmin);
    });
  });

  _calendarEventInvite = cp(policy => {
    const isOrganiser = ({ organiser_id } = {}) =>
      organiser_id == this.viewer?.id;

    policy.register(
      ['create', 'delete'],
      ({ event, status }, action) =>
        isOrganiser(event) ||
        this.isAdmin ||
        (this.isUser && status === 'Requested' && action === ':create'),
    );

    policy.register(
      'update',
      ({ user_id, event }) =>
        this.isSelf({ id: user_id }) || isOrganiser(event),
    );
    policy.include(['entity', 'user'], p => {
      p.register('update', () => false);
    });

    policy.include('status', p => {
      p.register('update', ({ user_id, event, status }) => {
        const requested = ['Requested', 'Refused'].includes(status);

        if (!requested) return this.isSelf({ id: user_id });

        if (requested) return isOrganiser(event);
      });
    });
  });
}
