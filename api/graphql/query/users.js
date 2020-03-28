import Models from 'Models';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class UsersResolver extends BaseConnectionResolver {
  entity = Models.User;
}

export default UsersResolver.resolver();
