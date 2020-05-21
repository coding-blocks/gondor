import BaseResolver from 'Graphql/base/Resolver';

class ZoomAccountAvailability extends BaseResolver {
  resolve = async () =>
    await this.ctx.loaders.zoomAccountAvailabilityLoader.load({
      id: this.parent.id,
      dateTimeRange: this.args.dateTimeRange,
    });
}

export default ZoomAccountAvailability.resolver();
