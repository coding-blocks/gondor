import InviteForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventInviteAccept extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id } = this.args;
    const form = new InviteForm({
      viewer,
      id,
      input: { status: 'Accepted' },
    });

    return form.update();
  };
}

export default CalendarEventInviteAccept.resolver();
