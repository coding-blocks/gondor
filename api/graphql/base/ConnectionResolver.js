import BaseResolver from './Resolver';

export default class BaseConnectionResolver extends BaseResolver {
  MAX_LIMIT = 30;

  resolve = async () => {
    const {
      limit = 0,
      before,
      after,
      orderBy,
      orderDirection = 'DESC',
    } = this.args;

    const { results, cursors } = await this.entity.paginate({
      limit: Math.max(limit, this.MAX_LIMIT),
      before,
      after,
      order: orderBy,
      desc: orderDirection === 'DESC',
      ...(this.query?.call(this) || {}),
    });

    return {
      edges: results.map(node => ({
        node,
        cursor: Buffer.from(JSON.stringify(node.id)).toString('base64'),
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
