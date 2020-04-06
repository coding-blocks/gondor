import Form from 'Services/ZoomAccount/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class ZoomAccountDelete extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id } = this.args;
    const form = new Form({
      viewer,
      id,
    });

    return form.delete();
  };
}

export default ZoomAccountDelete.resolver();
