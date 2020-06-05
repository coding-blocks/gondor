import Models from 'Models';
import BaseLoader from 'Services/BaseModelService/Loader';

export default class InviteStatus extends BaseLoader {
  async load() {
    const invites = await Models.CalendarEventInvite.findAll({
      where: {
        [Models.Sequelize.Op.or]: this.keys.map(({ user_id, event_id }) => ({
          user_id,
          event_id,
        })),
      },
    });

    return this.keys.map(
      (key) =>
        invites.find((invite) => invite.event_id === key.event_id)?.status,
    );
  }
}
