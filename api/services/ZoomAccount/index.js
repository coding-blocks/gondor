import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

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
}
