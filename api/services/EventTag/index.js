import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

export default class EventTag extends BaseModelService {
  @saveInstance
  async create(body) {
    return Models.EventTag.create(body);
  }

  @saveInstance
  @requireInstance
  async delete() {
    const count = await Models.EventTag.destroy({
      where: { id: this.instance.id },
    });

    if (count) return null;

    return this.instance;
  }
}
