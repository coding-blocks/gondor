import Models from 'Models';
import RequestForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventRequest extends BaseMutationResolver {
  resolve = async () => {
    const { viewer } = this.ctx;
    const { input } = this.args;

    const event = await Models.CalendarEvent.findByPk(input.event_id);

    const form = new RequestForm({
      viewer,
      input: {
        event_id: input.event_id,
        user_id: viewer.id,
        status:
          viewer.role === 'Admin' || event?.organiser_id === viewer.id
            ? 'Accepted'
            : 'Requested',
      },
    });

    return form.create();
  };
}

export default CalendarEventRequest.resolver();
