import Models from 'Models';
import { UserInputError } from 'apollo-server-micro';
import EventTagForm from 'Services/EventTag/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class TagUnassign extends BaseMutationResolver {
  resolve = async () => {
    const { viewer } = this.ctx;

    const eventTag = await Models.EventTag.findOne({
      where: this.args.input,
      include: [
        { model: Models.CalendarEvent, as: 'event' },
        { model: Models.Tag, as: 'tag' },
      ],
    });
    if (!eventTag) throw new UserInputError('No tag assigned exists');

    await new EventTagForm({ viewer, instance: eventTag }).delete();

    return eventTag.tag;
  };
}

export default TagUnassign.resolver();
