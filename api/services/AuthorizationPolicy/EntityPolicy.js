export const createPolicy = definition => {
  const policy = new EntityPolicy();
  definition(policy);

  return {
    apply: policy.apply,
    gather: policy.gather,
  };
};

const getProperty = (action = '') => {
  const parts = action.split(':');
  if (parts.length === 1) return null;

  return parts[0];
};

const getSubAction = action => action.replace(/^[^:]*:/, ':');

const getConcernName = action => {
  const parts = action.split(':');

  return parts[parts.length - 1];
};

export default class EntityPolicy {
  _concerns = {};
  _properties = {};

  register = (actions, policy) => {
    if (typeof actions === 'string') {
      actions = [actions];
    }

    actions.forEach(action => (this._concerns[action] = policy));
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
      const applyProperty = this._properties[property]?.apply;

      if (typeof applyProperty === 'function') {
        return applyProperty(entity, getSubAction(action));
      }

      return false;
    }

    const handler = this._concerns[getConcernName(action)];

    if (typeof handler === 'function') {
      return handler(entity, action);
    }

    return false;
  };

  _gatherConcerns = entity => {
    return Object.keys(this._concerns).reduce((map, name) => {
      map[name] = this._concerns[name](entity, `:${name}`);

      return map;
    }, {});
  };

  _gatherProperties = entity => {
    return Object.keys(this._properties).reduce((map, name) => {
      map[name] = this._properties[name].gather(entity);

      return map;
    }, {});
  };

  gather = (entity, what) => {
    if (what === 'concerns') return this._gatherConcerns(entity);
    if (what === 'properties') return this._gatherProperties(entity);
    if (what === 'all')
      return {
        concerns: this._gatherConcerns(entity),
        properties: this._gatherProperties(entity),
      };
  };
}
