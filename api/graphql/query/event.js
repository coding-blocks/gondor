import Models from 'Models';
import BaseEntityResolver from 'Graphql/base/EntityResolver';
import { UserInputError } from 'apollo-server';

class Event extends BaseEntityResolver {
  model = Models.CalendarEvent;
}

export default Event.resolver();
