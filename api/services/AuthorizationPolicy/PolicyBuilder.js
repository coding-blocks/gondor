export default class PolicyBuilder {
  constructor(user) {
    this.viewer = user;
  }

  authorize = action => ({
    on: (entity, name) =>
      this[`_${name || entity.constructor.name}`]?.apply(entity, action),
  });

  gather = (entity, name) => {
    const self = this;

    return {
      get concerns() {
        return (
          self[`_${name || entity.constructor.name}`]?.gather(
            entity,
            'concerns',
          ) || {}
        );
      },

      get properties() {
        return (
          self[`_${name || entity.constructor.name}`]?.gather(
            entity,
            'properties',
          ) || {}
        );
      },

      get all() {
        return (
          self[`_${name || entity.constructor.name}`]?.gather(
            entity,
            'all',
          ) || {
            concerns: {},
            properties: {},
          }
        );
      },
    };
  };

  get isAdmin() {
    return this.viewer?.roles.includes('Admin');
  }

  get isMentor() {
    return this.viewer?.roles.includes('Mentor');
  }

  get isMember() {
    return this.viewer?.roles.includes('Member');
  }
}
