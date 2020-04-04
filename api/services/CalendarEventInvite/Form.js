import Models from 'Models';
import CalendarEventInvite from './';
import BaseModelForm from 'Services/BaseModelService/Form';
import { saveInstance } from 'Services/BaseModelService';
import { ForbiddenError, UserInputError } from 'apollo-server-micro';

class CalendarEventInviteForm extends BaseModelForm {
  name = 'calendarEventInvite';
  text = 'event invite';

  attributes = {
    status: {
      protected: true,
      validate: status => {
        if (
          ['Requested', 'Refused'].includes(this.instance.status) &&
          status === 'Declined'
        )
          throw new ForbiddenError(
            `User is not authorized to perform this action.`,
          );

        return true;
      },
    },
    entity_id: {
      name: 'entity',
      protected: true,
    },
    user_id: {
      name: 'user',
      protected: true,
    },
  };

  @saveInstance
  async beforeAll() {
    if (this.id !== undefined) {
      const invite = await Models.CalendarEventInvite.findOne({
        where: { id: this.id },
        include: [
          { model: Models.CalendarEvent, as: 'event' },
          { model: Models.User, as: 'user' },
        ],
      });
      if (!invite) throw new UserInputError('No event invite found.');

      return invite.toJSON();
    }

    const data = this.instance;

    if (this.input?.event_id !== undefined)
      data.event = await Models.CalendarEvent.findByPk(this.input.event_id);

    return data;
  }

  onCreate() {
    return new CalendarEventInvite().create(this.body);
  }

  onUpdate() {
    return new CalendarEventInvite(this.instance).update(this.body);
  }

  onDelete() {
    return new CalendarEventInvite(this.instance).delete();
  }
}

export default CalendarEventInviteForm;
