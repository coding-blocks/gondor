import BaseResolver from './Resolver';

export default class BaseConnectionResolver extends BaseResolver {
  resolve = async () => {
    const { limit, before, after, orderBy, orderDirection } = this.args;

    const { results, cursors } = await this.entity.paginate({
      limit,
      before,
      after,
      order: orderBy,
      desc: orderDirection === 'DESC',
      ...(this.query?.call(this) || {}),
    });

    return {
      edges: results.map(node => ({ node })),
      pageInfo: {
        startCursor: cursors.before,
        endCursor: cursors.after,
        hasNextPage: cursors.hasNext,
        hasPreviousPage: cursors.hasPrevious,
      },
    };
  };
}
