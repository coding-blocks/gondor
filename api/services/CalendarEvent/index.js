import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
  withTransaction,
} from 'Services/BaseModelService';

export default class CalendarEvent extends BaseModelService {
  @saveInstance
  create(body) {
    return Models.CalendarEvent.create(body).then(event =>
      event
        .addAttendee(body.organiser_id, { through: { status: 'Accepted' } })
        .then(() => event),
    );
  }

  @saveInstance
  @requireInstance
  async update(body) {
    const [_updated, events] = await Models.CalendarEvent.update(body, {
      where: { id: this.instance.id },
      returning: true,
    });

    return events[0];
  }

  @saveInstance
  @requireInstance
  @withTransaction
  async delete(transaction) {
    const count = await Models.CalendarEvent.destroy({
      where: { id: this.instance.id },
      transaction,
    });

    await Models.CalendarEventInvite.destroy({
      where: { event_id: this.instance.id },
      transaction,
    });

    if (count) return null;

    throw this.instance;
  }
}
