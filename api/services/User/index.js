import uuid from 'uuid/v4';
import Models from 'Models';
import config from 'Config';
import jwt from 'jsonwebtoken';
import BaseModelService, {
  saveInstance,
  requireInstance,
  withTransaction,
} from 'Services/BaseModelService';
import UserRole from 'Services/UserRole';

export default class User extends BaseModelService {
  static findByUsername(username) {
    return Models.User.findOne({ where: { username } });
  }

  static async verifyAndFindFromToken(signedToken) {
    try {
      const { user_id, session_id } = await new Promise((resolve, reject) =>
        jwt.verify(signedToken, config.app.secret, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        }),
      );

      const token = await Models.ClientToken.findOne({
        where: { user_id, token: session_id },
      });
      if (!token) return null;

      return token.getUser();
    } catch (err) {
      return null;
    }
  }

  @saveInstance
  loadByUsername() {
    return User.findByUsername(...arguments);
  }

  @saveInstance
  verifyAndLoadFromToken() {
    return User.verifyAndFindFromToken(...arguments);
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
        roles: profile.roles?.map(name => ({ name })),
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

  @saveInstance
  @requireInstance
  @withTransaction
  async update(transaction, { roles, ...fields }) {
    let user = this._instance;

    if (Object.keys(fields).length) {
      const [updated, users] = await Models.User.update(
        { ...fields, roles: undefined },
        { where: { id: user.id }, returning: true, transaction },
      );

      if (!updated) {
        throw new Error('No user found to update.');
      }

      user = users[0].toJSON();
    } else {
      user = await Models.User.findByPk(user.id);
    }

    if (roles) {
      await Promise.all(
        roles.map(role =>
          Models.UserRole.findOrCreate({
            where: { name: role, user_id: user.id },
            defaults: { name: role, user_id: user.id },
            transaction,
          }),
        ),
      );

      await Models.UserRole.destroy({
        where: {
          name: { [Models.Sequelize.Op.notIn]: roles },
          user_id: user.id,
        },
        transaction,
      });
    }

    user.roles = roles;
    return user;
  }

  @requireInstance
  async generateToken() {
    const transaction = await Models.sequelize.transaction();

    await Models.ClientToken.destroy({
      where: { user_id: this._instance.id },
      transaction,
    });

    const token = uuid();

    await Models.ClientToken.create(
      { user_id: this._instance.id, token },
      { transaction },
    );

    await transaction.commit();

    return jwt.sign(
      { user_id: this._instance.id, session_id: token },
      config.app.secret,
    );
  }

  async _export(data) {
    if (!data) return null;

    data.roles = data.roles || (await UserRole.findNamesForUser(data));

    return data;
  }
}
