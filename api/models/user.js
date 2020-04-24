'use strict';

const withPagination = require('sequelize-cursor-pagination');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      mobile_number: {
        type: DataTypes.STRING,
      },
      photo: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('Admin', 'Member', 'User'),
        allowNull: false,
        defaultValue: 'User',
      },
      access_token: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    },
  );
  User.associate = function (models) {
    User.hasMany(models.ClientToken, {
      as: 'clientTokens',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.CalendarEvent, {
      as: 'eventsOrganising',
      foreignKey: 'organiser_id',
    });
    User.belongsToMany(models.CalendarEvent, {
      as: 'events',
      through: models.CalendarEventInvite,
      foreignKey: 'user_id',
      otherKey: 'event_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return withPagination()(User);
};
