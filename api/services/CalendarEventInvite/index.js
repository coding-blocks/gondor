import Models from 'Models';
import DataLoader from 'dataloader';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

export default class CalendarEventInvite extends BaseModelService {
  @saveInstance
  async create(body) {
    const [invite, created] = await Models.CalendarEventInvite.findOrCreate({
      where: {
        event_id: body.event_id,
        user_id: body.user_id,
      },
      defaults: {
        event_id: body.event_id,
        user_id: body.user_id,
        status: body.status || 'Pending',
      },
    });

    if (!created && ['Refused', 'Requested'].includes(invite.status)) {
      invite.status = 'Accepted';

      await invite.save();
    }

    if (!created && ['Declined'].includes(invite.status)) {
      invite.status = 'Pending';

      await invite.save();
    }

    return invite;
  }

  @saveInstance
  @requireInstance
  async update(body) {
    const [_updated, invites] = await Models.CalendarEventInvite.update(body, {
      where: { id: this._instance.id },
      returning: true,
    });

    return invites[0];
  }

  @saveInstance
  @requireInstance
  async delete() {
    const count = await Models.CalendarEventInvite.destroy({
      where: { id: this.instance.id },
    });

    if (count) return null;

    return this.instance;
  }

  static async findAllCalenderEventInviteStatus(keys) {
    return Models.CalendarEventInvite.findAll({
      where: {
        user_id: keys[0].viewer.id,
        event_id: {
          [Models.Sequelize.Op.in]: keys.map(({ event_id }) => event_id),
        },
      },
    })
      .then((invites) =>
        keys.map((key) =>
          invites.find((invite) => invite.event_id === key.event_id),
        ),
      )
      .map(({ status }) => status);
  }

  static getViewerCalendarEventInviteLoader() {
    return new DataLoader(CalendarEventInvite.findAllCalenderEventInviteStatus);
  }
}
