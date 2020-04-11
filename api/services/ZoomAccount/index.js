import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';

export default class ZoomAccount extends BaseModelService {
  @saveInstance
  create(body) {
    return Models.ZoomAccount.create(body);
  }

  @saveInstance
  @requireInstance
  async delete() {
    const count = await Models.ZoomAccount.destroy({
      where: { id: this.instance.id },
    });

    if (count) return null;

    return this.instance;
  }

  static findAllInUse(dateTimeRange) {
    return Models.ZoomAccount.findAll({
      include: [
        {
          model: Models.Resource,
          as: 'resources',
          include: [
            {
              model: Models.CalendarEvent,
              as: 'calendarEvents',
              where: overlapDateTimeClause(dateTimeRange),
              required: true,
            },
          ],
          required: true,
        },
      ],
    });
  }
}
