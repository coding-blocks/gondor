import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

export default class Resource extends BaseModelService {
  @saveInstance
  create(body) {
    return Models.Resource.create(body);
  }
  @saveInstance
  @requireInstance
  async delete() {
    const count = await Models.Resource.destroy({
      where: { id: this.instance.id },
    });

    if (count) return null;

    return this.instance;
  }
}
