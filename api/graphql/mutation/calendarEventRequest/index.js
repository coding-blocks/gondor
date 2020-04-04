import RequestForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventRequest extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { input } = this.args;
    const form = new RequestForm({
      viewer,
      input: {
        event_id: input.event_id,
        user_id: viewer.id,
        status: 'Requested',
      },
    });

    return form.create();
  };
}

export default CalendarEventRequest.resolver();
