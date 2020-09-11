import Models from 'Models';
import Tag from './';
import { UserInputError } from 'apollo-server-micro';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance } from 'Services/BaseModelService';

class TagForm extends BaseModelForm {
  name = 'tag';

  attributes = {
    title: {},
    code: {},
  };

  onCreate() {
    return new Tag().create(this.body);
  }
}

export default TagForm;
