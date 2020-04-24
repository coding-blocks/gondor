import Models from 'Models';
import { UserInputError } from 'apollo-server-micro';
import InviteForm from 'Services/CalendarEventInvite/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';
import gqlSafeActions from 'Utils/gqlSafeActions';

class CalendarEventInvite extends BaseMutationResolver {
  resolve = async () => {
    const { viewer } = this.ctx;
    const {
      input: { event_id, user_ids },
    } = this.args;

    const event = await Models.CalendarEvent.findByPk(event_id);

    if (!event) throw new UserInputError('No  event exists');

    return gqlSafeActions(
      user_ids.map((user_id) =>
        new InviteForm({
          viewer,
          input: { event_id, user_id, event },
        }).create(),
      ),
    );
  };
}

export default CalendarEventInvite.resolver();
