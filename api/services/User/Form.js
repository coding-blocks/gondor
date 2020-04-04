import User from './';
import { isEmail, isPhoneNumber } from 'Utils/validators';
import BaseModelForm from 'Services/BaseModelService/Form';

class UserForm extends BaseModelForm {
  name = 'user';

  attributes = {
    email: {
      validate: value => isEmail(value) || { error: 'Not a valid email.' },
      protected: true,
    },
    mobile_number: {
      validate: value =>
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
}

export default UserForm;
