import Models from 'Models';
import ZoomAccount from 'Services/ZoomAccount';
import BaseResolver from 'Graphql/base/Resolver';

class ZoomAccountAvailability extends BaseResolver {
  resolve = async () => {
    const resource = Models.Resource.build({
      topic_type: this.parent.topic_type,
      topic_id: this.parent.topic_id,
    });
    const topic = await resource.getTopic();

    if (this.parent.subject_type === 'ZoomAccount') {
      return await this.ctx.loaders.zoomAccountAvailability.load({
        id: this.parent.id,
        dateTimeRange: {
          start_at: topic.start_at,
          end_at: topic.end_at,
        },
        excludeEvents: [topic.id],
      });
    }

    //NOTE(naman) For a new resource add finding availability logic here
    return false;
  };
}

export default ZoomAccountAvailability.resolver();
