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
    name = name || entity.constructor.name;

    return {
      get concerns() {
        return (async () =>
          (await self[`_${name}`]?.gather(entity, 'concerns')) || {})();
      },

      get properties() {
        return (async () =>
          (await self[`_${name}`]?.gather(entity, 'properties')) || {})();
      },

      get all() {
        return (async () =>
          (await self[`_${name}`]?.gather(entity, 'all')) || {
            concerns: {},
            properties: {},
          })();
      },
    };
  };

  get isAdmin() {
    return this.viewer?.role === 'Admin';
  }

  get isMember() {
    return ['Admin', 'Member'].includes(this.viewer?.role);
  }

  get isUser() {
    return ['Admin', 'Member', 'User'].includes(this.viewer?.role);
  }

  isSelf(user) {
    return user.id == this.viewer?.id;
  }
}
