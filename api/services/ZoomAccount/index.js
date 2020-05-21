import Models from 'Models';
import DataLoader from 'dataloader';
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
    return Promise.all(
      keys.map(
        async ({ id, ...args }) =>
          !(await Models.ZoomAccount.findOne({
            where: { id },
            ...utilizedResourceClause(args),
          })),
      ),
    );
  }

  static getAvailabilityLoader() {
    return new DataLoader(this.findAllAvailabilityDuring);
  }

  @requireInstance
  async ifAvailableDuring(dateTimeRange, options) {
    return (
      await ZoomAccount.findAllAvailabilityDuring([
        {
          id: this.instance.id,
          dateTimeRange,
          ...options,
        },
      ])
    )[0];
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
