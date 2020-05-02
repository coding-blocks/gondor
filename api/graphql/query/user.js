import Models from 'Models';
import BaseEntityResolver from 'Graphql/base/EntityResolver';

class User extends BaseEntityResolver {
  model = Models.User;
}

export default User.resolver();
