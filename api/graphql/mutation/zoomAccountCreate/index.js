import Form from 'Services/ZoomAccount/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class ZoomAccountCreate extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { input } = this.args;
    const form = new Form({
      viewer,
      input,
    });

    return form.create();
  };
}

export default ZoomAccountCreate.resolver();
