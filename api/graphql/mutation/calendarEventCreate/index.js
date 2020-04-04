import EventForm from 'Services/CalendarEvent/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventCreate extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { input } = this.args;
    const form = new EventForm({
      viewer,
      input: { ...input, organiser_id: viewer?.id, user_id: viewer?.id },
    });

    return form.create();
  };
}

export default CalendarEventCreate.resolver();
