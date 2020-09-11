import Models from 'Models';
import EventTag from './';
import { UserInputError } from 'apollo-server-micro';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance } from 'Services/BaseModelService';

class EventTagForm extends BaseModelForm {
  name = 'eventTag';
  text = 'tag';

  attributes = {
    event: {},
    tag: {},
  };

  onCreate() {
    const { event, tag } = this.body;

    return new EventTag().create({ event_id: event.id, tag_id: tag.id });
  }

  onDelete() {
    return new EventTag(this.instance).delete();
  }
}

export default EventTagForm;
