import Models from 'Models';
import CalendarEvent from './';
import { UserInputError } from 'apollo-server-micro';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance } from 'Services/BaseModelService';

class CalendarEventForm extends BaseModelForm {
  name = 'calendarEvent';
  text = 'event';

  attributes = {
    title: {
      protected: true,
    },
    type: {
      protected: true,
    },
    description: {
      protected: true,
      allowNull: true,
    },
    location: {
      protected: true,
      allowNull: true,
    },
    start_at: {
      protected: true,
    },
    end_at: {
      protected: true,
    },
    organiser_id: {
      protected: true,
    },
  };

  onCreate() {
    return new CalendarEvent().create(this.body);
  }

  @saveInstance
  async beforeUpdate() {
    return this.fetchData();
  }

  onUpdate() {
    return new CalendarEvent(this.instance).update(this.body);
  }

  @saveInstance
  async beforeDelete() {
    return this.fetchData();
  }

  onDelete() {
    return new CalendarEvent(this.instance).delete();
  }

  async fetchData() {
    if (this.instance instanceof Models.CalendarEvent) return this.instance;

    const event = await Models.CalendarEvent.findByPk(this.id);
    if (!event) throw new UserInputError('No event found.');

    return event;
  }
}

export default CalendarEventForm;
