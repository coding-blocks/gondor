import Models from 'Models';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';

export default class User extends BaseModelService {
  static findByUsername(username) {
    return Models.User.findOne({ where: { username } });
  }

  @saveInstance
  loadByUsername() {
    return User.findByUsername(...arguments);
  }

  @saveInstance
  create(profile) {
    return Models.User.create(
      {
        ...[
          'username',
          'firstname',
          'lastname',
          'email',
          'mobile_number',
          'photo',
          'access_token',
        ].reduce((data, field) => ({ ...data, [field]: profile[field] }), {}),
        roles: profile.roles?.map(role => ({ role })),
      },
      { include: [{ model: Models.UserRole, as: 'roles' }] },
    );
  }

  @saveInstance
  @requireInstance
  async syncProfile(profile) {
    const user = this._instance;
    const {
      firstname = user.firstname,
      lastname = user.lastname,
      email = user.email,
      mobile_number = user.mobile_number,
      photo = user.photo,
      access_token = user.access_token,
    } = profile;

    const [updated, users] = await Models.User.update(
      {
        firstname,
        lastname,
        email,
        mobile_number,
        photo,
        access_token,
      },
      {
        where: { id: user.id },
        returning: true,
      },
    );

    return users[0];
  }

  async _export(instance) {
    if (!instance) return;

    let roles = !!instance.roles
      ? instance.roles
      : await Models.UserRole.findAll({ where: { user_id: instance.id } });
    roles = roles.map(({ role }) => role);

    return (
      instance && {
        ...instance,
        roles,
      }
    );
  }
}
