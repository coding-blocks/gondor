import Models from 'Models';
import BaseResolver from 'Graphql/base/Resolver';
import ZoomAccount from 'Services/ZoomAccount';

class ZoomAccounts extends BaseResolver {
  resolve = async () => {
    let excludeIds = [];

    if (this.args.availableDuring) {
      excludeIds = (
        await ZoomAccount.findAllInUse(this.args.availableDuring)
      ).map(account => account.id);
    }

    return Models.ZoomAccount.findAll({
      where: {
        id: {
          [Models.Sequelize.Op.notIn]: excludeIds,
        },
      },
    });
  };
}

export default ZoomAccounts.resolver();
