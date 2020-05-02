import Models from 'Models';
import ResourceForm from 'Services/Resource/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';
import { UserInputError } from 'apollo-server-micro';

class ResourceCreate extends BaseMutationResolver {
  resolve = async () => {
    const { viewer } = this.ctx;
    const { input } = this.args;

    const form = new ResourceForm({
      viewer,
      input,
    });

    return form.create();
  };
}

export default ResourceCreate.resolver();
