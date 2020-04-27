import Models from 'Models';
import AuthPolicy from 'Services/AuthorizationPolicy';
import BaseModelService, { saveInstance, RequiredInstanceError } from './';
import { ForbiddenError, UserInputError } from 'apollo-server-micro';

class ModelForm extends BaseModelService {
  constructor({ viewer, id, input, instance }) {
    super(instance || { id: id ? Number(id) : id, ...(input || {}) });
    this.viewer = viewer;
    this.id = id ? Number(id) : id;
    this.input = input;
  }

  attributes = {};

  _handleForeignKeyConstraintError = (err) => {
    const columnName = ((str) => str.substring(5, str.length - 2))(
      err.parent.detail?.match(/^Key \([^\)]*\)=/)[0] || '',
    );

    if (columnName && typeof this.input[columnName] !== 'undefined') {
      const attribute = this.attributes[columnName];
      const name = attribute?.name || columnName;
      const field = attribute?.graphqlName || columnName;
      const message =
        attribute?.foreignKeyConstraintError || `No ${name} found.`;

      throw new UserInputError(message, {
        validationErrors: [{ field, message }],
      });
    }
  };

  _handleUniqueConstraintError = (err) => {
    const fields = Object.keys(err.fields).filter(
      (field) => typeof this.input[field] !== 'undefined',
    );
    if (!fields.length) return;

    const graphqlFields = fields.map(
      (field) => this.attributes[field]?.graphqlName || field,
    );
    const message = `A ${this.text || this.name} with same ${graphqlFields.join(
      ', ',
    )} already exists.`;

    throw new UserInputError(message, {
      validationErrors: graphqlFields.map((field) => ({
        field,
        message: 'Must be unique.',
      })),
    });
  };

  _handleRequiredInstanceError = () => {
    throw new UserInputError(
      `The ${
        this.text || this.name
      } you are trying to perform action on does not exist.`,
    );
  };

  _handleErrors = async (cb) => {
    try {
      return await cb();
    } catch (err) {
      if (err instanceof Models.Sequelize.ForeignKeyConstraintError) {
        this._handleForeignKeyConstraintError(err);
      }

      if (err instanceof Models.Sequelize.UniqueConstraintError) {
        this._handleUniqueConstraintError(err);
      }

      if (err instanceof RequiredInstanceError) {
        this._handleRequiredInstanceError(err);
      }

      throw err;
    }
  };

  async preCreate() {
    const name = this.name;
    const policy = AuthPolicy.can(this.viewer);

    if (
      !policy.perform(`${name}:create`).having(this.input).on(this.instance)
    ) {
      console.log(`${name}:create`);
      throw new ForbiddenError(
        `User is not authorized to perform this action.`,
      );
    }

    const validationErrors = [];
    const data = {};

    await Promise.all(
      Object.keys(this.input).map(async (inputField) => {
        const value = this.input[inputField];
        const attribute = this.attributes[inputField];

        // perform validation if validator available for the attribute
        if (typeof attribute?.validate === 'function') {
          const result = attribute.validate(this.input[inputField]);
          if (result !== true) {
            validationErrors.push({ field: inputField, error: result.error });
            return;
          }
        }

        data[inputField] = attribute?.transform
          ? await attribute.transform(value)
          : value;
      }),
    );

    if (validationErrors.length)
      throw new UserInputError('Invalid input provided.', {
        validationErrors,
      });

    return data;
  }

  async preUpdate() {
    const name = this.name;
    const policy = AuthPolicy.can(this.viewer);

    if (
      !(await policy
        .perform(`${name}:update`)
        .having(this.input)
        .on(this.instance))
    ) {
      throw new ForbiddenError(
        `User is not authorized to perform this action.`,
      );
    }

    const authorizationErrors = [];
    const validationErrors = [];
    const data = {};

    await Promise.all(
      Object.keys(this.input).map(async (inputField) => {
        const value = this.input[inputField];
        const attribute = this.attributes[inputField];

        // throw error for null input unless null allowed
        if (value === null && !attribute?.allowNull) {
          validationErrors.push({
            field: inputField,
            error: 'Null value not allowed.',
          });
          return;
        }

        // check policy for protected attribute
        if (
          attribute?.protected &&
          !(await policy
            .perform(`${name}:${attribute.name || inputField}:update`)
            .having(this.input[inputField])
            .on(this.instance))
        ) {
          authorizationErrors.push(inputField);
          return;
        }

        // perform validation if validator available for the attribute
        if (typeof attribute?.validate === 'function') {
          const result = attribute.validate(this.input[inputField]);
          if (result !== true) {
            validationErrors.push({ field: inputField, error: result.error });
            return;
          }
        }

        data[inputField] = attribute?.transform
          ? await attribute.transform(value)
          : value;

        return data[inputField];
      }),
    );

    if (authorizationErrors.length)
      throw new ForbiddenError(
        `User is not allowed to update ${
          authorizationErrors.length > 1 ? 'properties' : 'property'
        } ${authorizationErrors.join(', ')}`,
      );

    if (validationErrors.length)
      throw new UserInputError('Invalid input provided.', {
        validationErrors,
      });

    return data;
  }

  async preDelete() {
    if (
      !(await AuthPolicy.can(this.viewer)
        .perform(`${this.name}:delete`)
        .on(this.instance))
    )
      throw new ForbiddenError(
        `User is not authorized to perform this action.`,
      );
  }

  @saveInstance
  async create() {
    await this.beforeAll?.call(this);
    await this.beforeCreate?.call(this);
    this.body = await this.preCreate?.call(this);
    const data =
      (await this._handleErrors(() => this.onCreate?.call(this))) || null;
    this.afterCreate?.call(this);

    return data;
  }

  @saveInstance
  async update() {
    await this.beforeAll?.call(this);
    await this.beforeUpdate?.call(this);
    this.body = await this.preUpdate?.call(this);
    const data =
      (await this._handleErrors(() => this.onUpdate?.call(this))) || null;
    if (data === null)
      throw new UserInputError(`No ${this.text || this.name} found to update`);
    this.afterUpdate?.call(this);

    return data;
  }

  @saveInstance
  async delete() {
    await this.beforeAll?.call(this);
    await this.beforeDelete?.call(this);
    await this.preDelete?.call(this);
    const success =
      (await this._handleErrors(() => this.onDelete?.call(this))) === null;
    if (!success)
      throw new UserInputError(`No ${this.text || this.name} found to delete`);
    this.afterDelete?.call(this);

    return this.instance;
  }
}

export default ModelForm;
