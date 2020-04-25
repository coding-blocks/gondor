import Models from 'Models';
import BaseEntityResolver from 'Graphql/base/EntityResolver';

class Event extends BaseEntityResolver {
  model = Models.CalendarEvent;
}

export default Event.resolver();
