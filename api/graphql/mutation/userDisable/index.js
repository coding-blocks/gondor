import UserForm from 'Services/User/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class UserDisable extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { id } = this.args;
    const form = new UserForm({
      viewer,
      id,
    });

    return form.delete();
  };
}

export default UserDisable.resolver();
