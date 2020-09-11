import Models from 'Models';
import BaseModelService, {
  saveInstance,
  withTransaction,
} from 'Services/BaseModelService';
import slugify from 'slugify';

export default class Tag extends BaseModelService {
  @saveInstance
  @withTransaction
  async create(transaction, body) {
    let slug = slugify(body.title);
    const similarSlugsCount = await Models.Tag.count({
      where: {
        slug: {
          [Models.Sequelize.Op.startsWith]: slug,
        },
      },
      transaction,
    });

    if (similarSlugsCount) {
      slug = `${slug}-${similarSlugsCount + 1}`;
    }

    return Models.Tag.create(
      {
        slug,
        ...body,
      },
      { transaction },
    );
  }
}
