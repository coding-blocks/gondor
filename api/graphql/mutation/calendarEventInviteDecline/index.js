import InviteForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventDecline extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id } = this.args;
    const form = new InviteForm({
      viewer,
      id,
      input: { status: 'Declined' },
    });

    return form.update();
  };
}

export default CalendarEventDecline.resolver();
