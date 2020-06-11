import Models from 'Models';
import BaseResolver from './Resolver';

export default class BaseConnectionResolver extends BaseResolver {
  MAX_LIMIT = 30;

  resolve = async () => {
    const {
      limit,
      before,
      after,
      orderBy,
      exclude,
      orderDirection = 'DESC',
    } = this.args;
    const Op = Models.Sequelize.Op;
    const where = {};

    if (exclude?.length) where.id = { [Op.notIn]: exclude };

    const query = (await this.query?.call(this)) || {};

    query.where = query.where ? { [Op.and]: [query.where, where] } : where;

    const { results, cursors } = await this.model.paginate({
      limit: this.MAX_LIMIT ? Math.min(limit || 1, this.MAX_LIMIT) : limit,
      before,
      after,
      order: orderBy,
      desc: orderDirection === 'DESC',
      ...query,
    });

    return {
      edges: results.map((node) => ({
        node,
        cursor: Buffer.from(JSON.stringify([node.id])).toString('base64'),
      })),
      pageInfo: {
        startCursor: cursors.before,
        endCursor: cursors.after,
        hasNextPage: cursors.hasNext,
        hasPreviousPage: cursors.hasPrevious,
      },
    };
  };
}
