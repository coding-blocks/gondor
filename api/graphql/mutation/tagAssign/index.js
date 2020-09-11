import Models from 'Models';
import { UserInputError } from 'apollo-server-micro';
import EventTagForm from 'Services/EventTag/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class TagAssign extends BaseMutationResolver {
  resolve = async () => {
    const { viewer } = this.ctx;
    const {
      input: { event_id, tag_id },
    } = this.args;

    const event = await Models.CalendarEvent.findByPk(event_id);
    if (!event) throw new UserInputError('No event exists');

    const tag = await Models.Tag.findByPk(tag_id);
    if (!tag) throw new UserInputError('No event exists');

    await new EventTagForm({ viewer, input: { event, tag } }).create();
    return tag;
  };
}

export default TagAssign.resolver();
