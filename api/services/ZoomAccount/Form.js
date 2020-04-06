import Models from 'Models';
import ZoomAccount from './';
import { isEmail } from 'Utils/validators';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance, requireInstance } from 'Services/BaseModelService';
import { ForbiddenError, UserInputError } from 'apollo-server-micro';

class ZoomAccountForm extends BaseModelForm {
  name = 'zoomAccount';
  text = 'zoom account';

  attributes = {
    email: {
      validate: value => isEmail(value) || { error: 'Not a valid email.' },
    },
  };

  onCreate() {
    return new ZoomAccount().create(this.body);
  }

  @saveInstance
  @requireInstance
  async beforeDelete() {
    return Models.ZoomAccount.findByPk(this.id);
  }

  @requireInstance
  onDelete() {
    return new ZoomAccount(this.instance).delete();
  }
}

export default ZoomAccountForm;
