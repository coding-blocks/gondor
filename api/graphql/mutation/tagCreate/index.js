import TagForm from 'Services/Tag/Form';
import BaseMutationResolver from 'Graphql/base/MutationResolver';

class TagCreate extends BaseMutationResolver {
  resolve = () => {
    const { viewer } = this.ctx;
    const { input } = this.args;
    const form = new TagForm({
      viewer,
      input,
    });

    return form.create();
  };
}

export default TagCreate.resolver();
