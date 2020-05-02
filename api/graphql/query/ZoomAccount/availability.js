import ZoomAccount from 'Services/ZoomAccount';
import BaseResolver from 'Graphql/Base/Resolver';

class ZoomAccountAvailability extends BaseResolver {
  resolve = () =>
    ZoomAccount.findAvailaibilityDuring(
      this.parent.id,
      this.args.dateTimeRange,
    );
}

export default ZoomAccountAvailability.resolver();
