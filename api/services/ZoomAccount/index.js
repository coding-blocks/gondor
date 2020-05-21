import DataLoader from 'dataloader';
import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';
import { utilizedResourceClause } from './utils';

export default class ZoomAccount extends BaseModelService {
  static findAllInUse(...args) {
    return Models.ZoomAccount.findAll(utilizedResourceClause(...args));
  }
  static async findAllAvailabilityDuring(keys) {
    const resultPromises = keys.map(async (key) => {
      const { id, ...args } = key;
      return !(await Models.ZoomAccount.findOne({
        where: { id },
        ...utilizedResourceClause(args),
      }));
    });

    return Promise.all(resultPromises);
  }

  static getAvailabilityLoader() {
    return new DataLoader(this.findAllAvailabilityDuring);
  }

  @requireInstance
  async ifAvailableDuring(dateTimeRange, options) {
    const key = {
      id: this.instance.id,
      dateTimeRange,
      options,
    };

    return (await ZoomAccount.findAllAvailabilityDuring([key]))[0];
  }

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
