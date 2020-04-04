import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

export default class CalendarEventInvite extends BaseModelService {
  @saveInstance
  create(body) {
    return Models.CalendarEventInvite.create(body);
  }

  @saveInstance
  async update(body) {
    const [_updated, invites] = await Models.CalendarEventInvite.update(body, {
      where: { id: this._instance.id },
      returning: true,
    });

    return invites[0];
  }

  @saveInstance
  async delete(body) {
    const count = await Models.CalendarEventInvite.destroy({
      where: { id: this.instance.id },
    });

    if (count) return null;

    return this.instance;
  }
}
