import DataLoader from 'dataloader';
import uuid from 'uuid/v4';
import Models from 'Models';
import config from 'Config';
import jwt from 'jsonwebtoken';
import BaseModelService, {
  saveInstance,
  requireInstance,
} from 'Services/BaseModelService';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';

export default class User extends BaseModelService {
  static findByUsername(username) {
    return Models.User.findOne({ where: { username } });
  }

  static findById(id) {
    return Models.User.findOne({ where: { id } });
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

  static async findAllAvailabilityDuring(keys) {
    const resultPromises = keys.map((key) => {
      return Models.CalendarEventInvite.scope('visible').findOne({
        where: {
          user_id: key.user_id,
        },
        include: [
          {
            model: Models.CalendarEvent,
            as: 'event',
            where: {
              [Models.Sequelize.Op.and]: [
                overlapDateTimeClause(key.dateTimeRange),
                {
                  id: {
                    [Models.Sequelize.Op.notIn]: key.exculdeEvents,
                  },
                },
              ],
            },
            required: true,
          },
        ],
      });
    });
    const result = await Promise.all(resultPromises);
    return result.map((data) => !data);
  }

  static getAvailabilityLoader() {
    return new DataLoader(this.findAllAvailabilityDuring);
  }

  @requireInstance
  ifAvailableDuring(dateTimeRange, exculdeEvents) {
    const key = {
      user_id: this.instance.id,
      dateTimeRange,
      exculdeEvents,
    };
    return User.getAvailabilityLoader().load(key);
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
    return Models.User.create({
      ...[
        'username',
        'firstname',
        'lastname',
        'email',
        'mobile_number',
        'photo',
        'access_token',
        'role',
      ].reduce((data, field) => ({ ...data, [field]: profile[field] }), {}),
    });
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
  async update(fields) {
    const [_updated, users] = await Models.User.update(fields, {
      where: { id: this._instance.id },
      returning: true,
    });

    return users[0];
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
}
