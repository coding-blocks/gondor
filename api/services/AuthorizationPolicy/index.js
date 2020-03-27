import { createPolicy } from './EntityPolicy';

export default class AuthorizationPolicy {
  static can = viewer => ({
    perform: new AuthorizationPolicy(viewer).authorize,
  });

  constructor(user) {
    this.viewer = user;
  }

  authorize = action => ({
    on: (entity, name) =>
      this[`_${name || entity.constructor.name}`]?.call(this, entity, action),
  });

  get isAdmin() {
    return this.viewer?.roles.includes('Admin');
  }

  get isMentor() {
    return this.viewer?.roles.includes('Mentor');
  }

  get isMember() {
    return this.viewer?.roles.includes('Member');
  }

  _user = createPolicy(policy => {
    const isSelf = user => user.id === this.viewer?.id;

    policy.register('read', () => !!this.viewer);

    policy.include(['email', 'mobile_number', 'photo'], p => {
      p.register('read', user => isSelf(user) || this.isAdmin || this.isMember);
      p.register('update', user => isSelf(user) || this.isAdmin);
    });

    policy.include('roles', p => {
      p.register('read', user => isSelf(user) || this.isAdmin || this.isMember);
      p.register('update', user => this.isAdmin);
    });
  });
}
