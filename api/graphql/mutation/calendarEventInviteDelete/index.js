import InviteForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class CalendarEventInviteDelete extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id } = this.args;
    const form = new InviteForm({ viewer, id });

    return form.delete();
  };
}

export default CalendarEventInviteDelete.resolver();
