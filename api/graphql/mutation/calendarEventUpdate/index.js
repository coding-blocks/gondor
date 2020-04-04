import EventForm from 'Services/CalendarEvent/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventUpdate extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id, input } = this.args;
    const form = new EventForm({ viewer, id, input });

    return form.update();
  };
}

export default CalendarEventUpdate.resolver();
