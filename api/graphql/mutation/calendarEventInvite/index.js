import InviteForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventInvite extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { input } = this.args;
    const form = new InviteForm({ viewer, input });

    return form.create();
  };
}

export default CalendarEventInvite.resolver();
