import Models from 'Models';
import BaseEntityResolver from 'Graphql/base/EntityResolver';
import { UserInputError } from 'apollo-server';

class Event extends BaseEntityResolver {
  model = Models.CalendarEvent;

  validate = () => {
    const { id, slug } = this.args;

    if ((id === slug) === undefined) {
      throw new UserInputError('Require a valid id or slug');
    }
  };
}

export default Event.resolver();
