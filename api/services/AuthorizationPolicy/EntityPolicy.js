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

  apply = (_entity, action) => {
    const property = getProperty(action);
    const entity =
      typeof _entity?.toJSON === 'function' ? _entity.toJSON() : _entity;

    if (!!property) {
      const applyProperty = this._properties[property]?.apply;

      if (typeof applyProperty === 'function') {
        const a = Promise.resolve(applyProperty(entity, getSubAction(action)));
        return a;
      }

      return Promise.resolve(false);
    }

    const handler = this._concerns[getConcernName(action)];

    if (typeof handler === 'function') {
      return Promise.resolve(handler(entity, action));
    }

    return Promise.resolve(false);
  };

  _gatherConcerns = entity => {
    return Object.keys(this._properties).reduce(async (_map, name) => {
      const map = await _map;

      return this._concerns[name](entity, `:${name}`).then(data => {
        map[name] = data;
        return map;
      });
    }, Promise.resolve({}));
  };

  _gatherProperties = entity => {
    return Object.keys(this._properties).reduce(async (_map, name) => {
      const map = await _map;

      return this._properties[name].gather(entity).then(data => {
        map[name] = data;
        return map;
      });
    }, Promise.resolve({}));
  };

  gather = async (_entity, what) => {
    const entity =
      typeof _entity?.toJSON === 'function' ? _entity.toJSON() : _entity;

    if (what === 'concerns')
      return Promise.resolve(this._gatherConcerns(entity));
    if (what === 'properties')
      return Promise.resolve(this._gatherProperties(entity));
    if (what === 'all') {
      const [concerns, properties] = await Promise.all(
        this._gatherConcerns(entity),
        this._gatherProperties(entity),
      );

      return { concerns, properties };
    }
  };
}
