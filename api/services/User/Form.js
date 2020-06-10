import Models from 'Models';
import User from './';
import { isEmail, isPhoneNumber } from 'Utils/validators';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance, requireInstance } from 'Services/BaseModelService';

class UserForm extends BaseModelForm {
  name = 'user';

  attributes = {
    email: {
      validate: (value) => isEmail(value) || { error: 'Not a valid email.' },
      protected: true,
    },
    mobile_number: {
      validate: (value) =>
        isPhoneNumber(value) || { error: 'Not a valid phone number' },
      protected: true,
    },
    role: {
      protected: true,
    },
  };

  onUpdate() {
    return new User(this.instance).update(this.body);
  }

  @saveInstance
  @requireInstance
  async beforeDelete() {
    return Models.User.findByPk(this.id);
  }

  @requireInstance
  onDelete() {
    return new User(this.instance).delete();
  }
}

export default UserForm;
