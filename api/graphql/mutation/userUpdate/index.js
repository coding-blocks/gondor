import UserForm from 'Services/User/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class UserUpdate extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id, input } = this.args;
    const form = new UserForm({ viewer, id, input });

    return form.update();
  };
}

export default UserUpdate.resolver();
