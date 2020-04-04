'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CalendarEventInvite = sequelize.define(
    'calendar_event_invite',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM(
          'Pending',
          'Accepted',
          'Declined',
          'Requested',
          'Refused',
        ),
        allowNull: false,
        defaultValue: 'Pending',
      },
    },
    {
      scopes: {
        visible: {
          where: {
            status: {
              [Sequelize.Op.notIn]: ['Declined', 'Refused'],
            },
          },
        },
      },
      indexes: [{ unique: true, fields: ['event_id', 'user_id'] }],
    },
  );

  CalendarEventInvite.associate = function(models) {
    CalendarEventInvite.belongsTo(models.User, {
      as: 'user',
      foreignKey: { name: 'user_id', allowNull: false },
    });
    CalendarEventInvite.belongsTo(models.CalendarEvent, {
      as: 'event',
      foreignKey: { name: 'event_id', allowNull: false },
    });
  };

  return CalendarEventInvite;
};
