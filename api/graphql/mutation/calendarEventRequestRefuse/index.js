import RequestForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventRequestRefuse extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id, input } = this.args;
    const form = new RequestForm({
      viewer,
      id,
      input: {
        status: 'Refused',
      },
    });

    return form.update();
  };
}

export default CalendarEventRequestRefuse.resolver();
