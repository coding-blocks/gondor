import ResourceForm from 'Services/Resource/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';
import { UserInputError } from 'apollo-server-micro';

class ResourceDelete extends BaseMutationResolver {
  resolve = async () => {
    const { viewer } = this.ctx;
    const { id } = this.args;

    const form = new ResourceForm({
      viewer,
      id,
    });

    return form.delete();
  };
}

export default ResourceDelete.resolver();
