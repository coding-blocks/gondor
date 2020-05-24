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

  static async findAvailaibilityDuring(id, ...args) {
    const data = await Models.ZoomAccount.findOne({
      where: { id },
      ...utilizedResourceClause(...args),
    });
    return !data;
  }

  static async findAllAvailabilityDuring(keys) {
    const { id, dateTimeRange, ...options } = keys[0];
    return Models.ZoomAccount.findAll({
      where: {
        id: {
          [Models.Sequelize.Op.in]: keys.map(({ id }) => id),
        },
      },
      ...utilizedResourceClause(dateTimeRange, options),
    }).then((accounts) =>
      keys.map((key) => !accounts.find((account) => key.id === account.id)),
    );
  }

  static getAvailabilityLoader() {
    return new DataLoader(this.findAllAvailabilityDuring);
  }

  @requireInstance
  async ifAvailableDuring(dateTimeRange, options) {
    return ZoomAccount.findAvailaibilityDuring(
      this.instance.id,
      dateTimeRange,
      options,
    );
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
