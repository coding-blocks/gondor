import Models from 'Models';
import BaseEntityResolver from 'Graphql/base/EntityResolver';

class Tag extends BaseEntityResolver {
  model = Models.Tag;
}

export default Tag.resolver();
