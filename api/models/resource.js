'use strict';
module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    'resource',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      subject_type: {
        type: DataTypes.ENUM('ZoomAccount'),
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      topic_type: {
        type: DataTypes.ENUM('CalendarEvent'),
        allowNull: false,
      },
      topic_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['subject_type', 'subject_id', 'topic_type', 'topic_id'],
        },
      ],
    },
  );

  Resource.associate = function (models) {
    Resource.belongsTo(models.ZoomAccount, {
      as: 'zoomAccount',
      foreignKey: 'subject_id',
      constraints: false,
    });
    Resource.belongsTo(models.CalendarEvent, {
      as: 'calendarEvent',
      foreignKey: 'topic_id',
      constraints: false,
    });
  };

  Resource.prototype.getSubject = function () {
    return this[`get${this.subject_type}`]();
  };

  Resource.prototype.getTopic = function () {
    return this[`get${this.topic_type}`]();
  };

  Resource.addHook('afterFind', (findResult) => {
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
      const subjects = Resource.rawAttributes.subject_type.values;
      const topics = Resource.rawAttributes.topic_type.values;

      subjects.forEach((s) => {
        const attribute = camelcase(s);
        if (instance.subject_type === s && instance[attribute] !== undefined) {
          instance.subject = instance[attribute];
        }

        delete instance[attribute];
        delete instance.dataValues[attribute];
      });

      topics.forEach((t) => {
        const attribute = camelcase(t);
        if (instance.topic_type === t && instance[attribute] !== undefined) {
          instance.topic = instance[attribute];
        }

        delete instance[attribute];
        delete instance.dataValues[attribute];
      });
    }
  });
  return Resource;
};
