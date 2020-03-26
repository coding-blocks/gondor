import Models from 'Models';
import BaseModelService from 'Services/BaseModelService';

export default class UserRole extends BaseModelService {
  static async findNamesForUser(user) {
    return (
      await Models.UserRole.findAll(
        { where: { user_id: user.id } },
        { attributes: ['name'] },
      )
    ).map(({ name }) => name);
  }
}
