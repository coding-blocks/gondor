export const createPolicy = definition => {
  const policy = new EntityPolicy();
  definition(policy);
  return policy.apply;
};

const getProperty = (action = '') => {
  const parts = action.split(':');
  if (parts.length === 1) return null;

  return parts[0];
};

const getSubAction = action =>
  action
    .split(':')
    .slice(1)
    .join(':');

const getPolicyName = action => {
  const parts = action.split(':');

  return parts[parts.length - 1];
};

export default class EntityPolicy {
  _policies = {};
  _properties = {};

  register = (actions, policy) => {
    if (typeof actions === 'string') {
      actions = [actions];
    }

    actions.forEach(action => (this._policies[action] = policy));
  };

  include = (properties, definition) => {
    if (typeof properties === 'string') {
      properties = [properties];
    }

    const policy = createPolicy(definition);

    properties.forEach(property => (this._properties[property] = policy));
  };

  apply = (entity, action) => {
    const property = getProperty(action);

    if (!!property) {
      const applyProperty = this._properties[property];

      if (typeof applyProperty === 'function') {
        return applyProperty(entity, getSubAction(action));
      }

      return false;
    }

    const handler = this._policies[getPolicyName(action)];

    if (typeof handler === 'function') {
      return handler(entity, action);
    }

    return false;
  };
}
