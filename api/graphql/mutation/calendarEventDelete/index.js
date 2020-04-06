import EventForm from 'Services/CalendarEvent/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventDelete extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id } = this.args;
    const form = new EventForm({
      viewer,
      id,
    });

    return form.delete();
  };
}

export default CalendarEventDelete.resolver();
