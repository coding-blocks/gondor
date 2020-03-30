import Policy from 'Services/AuthorizationPolicy';
import BaseModelService, { saveInstance } from './';
import { ForbiddenError, UserInputError } from 'apollo-server-micro';

class ModelForm extends BaseModelService {
  constructor({ viewer, id, input }) {
    super({ id: Number(id) });
    this.viewer = viewer;
    this.id = Number(id);
    this.input = input;
  }

  attributes = {};

  preUpdate() {
    const name = this.name;
    const policy = new Policy(this.viewer);

    if (!policy.authorize(':update').on(this._instance, name)) {
      throw new ForbiddenError(
        `User is not authorized to perform this action.`,
      );
    }

    const authorizationErrors = [];
    const validationErrors = [];

    const data = Object.keys(this.input).reduce((data, inputField) => {
      const value = this.input[inputField];
      const attribute = this.attributes[inputField];

      // ignore null input unless null allowed
      if (value === null && !attribute?.allowNull) return data;

      // check policy for protected attribute
      if (
        attribute?.protected &&
        !policy
          .authorize(`${attribute.name || inputField}:update`)
          .on(this._instance, name)
      ) {
        authorizationErrors.push(inputField);
        return data;
      }

      // perform validation if validator available for the attribute
      if (typeof attribute?.validate === 'function') {
        const result = attribute.validate(this.input[inputField]);
        if (result !== true) {
          validationErrors.push({ field: inputField, error: result.error });
          return data;
        }
      }

      data[inputField] = value;

      return data;
    }, {});

    if (authorizationErrors.length)
      throw new ForbiddenError(
        `User is not allowed to update ${
          authorizationErrors.length > 1 ? 'properties' : 'property'
        } ${authorizationErrors.join(', ')}`,
      );

    if (validationErrors.length)
      throw new UserInputError('Invalid arguments provided.', {
        validationErrors,
      });

    return data;
  }

  @saveInstance
  async update() {
    this.updatedFields = await this.preUpdate?.call(this);
    const data = await this.onUpdate?.call(this);
    this.afterUpdate?.call(this);

    return data;
  }
}

export default ModelForm;
