import Models from 'Models';
import Resource from './';
import { UserInputError } from 'apollo-server-micro';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance } from 'Services/BaseModelService';

class ResourceForm extends BaseModelForm {
  name = 'resource';

  @saveInstance
  async beforeCreate() {
    const { subject_type, subject_id, topic_type, topic_id } = this.input;
    const [topic, subject] = await Promise.all([
      Models[subject_type].findByPk(subject_id),
      Models[topic_type].findByPk(topic_id),
    ]);
    const validationErrors = [];

    if (!topic)
      validationErrors.push({ field: 'topic_id', error: 'Not Found' });
    if (!subject)
      validationErrors.push({ field: 'subject_id', error: 'Not Found' });

    if (!validationErrors.length)
      throw new UserInputError('Wrong Input', { validationErrors });

    return {
      subject,
      subject_id,
      subject_type,
      topic,
      topic_id,
      topic_type,
    };
  }

  @saveInstance
  async beforeCreate() {
    return Models.Resource.findByPk(this.id, {
      includes: [Models.ZoomAccount, Models.CalendarEvent],
    });
  }

  onCreate() {
    return new Resource().create(this.input);
  }

  onDelete() {
    return new CalendarEvent(this.instance).delete();
  }
}

export default ResourceForm;
