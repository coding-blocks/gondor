import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

export default class CalendarEvent extends BaseModelService {
  @saveInstance
  create(body) {
    return Models.CalendarEvent.create(body).then(event =>
      event
        .addInvite(body.organiser_id, { through: { status: 'Accepted' } })
        .then(() => event),
    );
  }

  @saveInstance
  async update(body) {
    const [_updated, events] = await Models.CalendarEvent.update(body, {
      where: { id: this.instance.id },
      returning: true,
    });

    return events[0];
  }
}
