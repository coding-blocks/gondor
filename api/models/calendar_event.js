'use strict';

const withPagination = require('sequelize-cursor-pagination');

module.exports = (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define(
    'calendar_event',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM(
          'OfflineClass',
          'OnlineClass',
          'CourseRecording',
          'OffSiteWorkshop',
          'Metting',
          'OOO',
          'Other',
        ),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
      },
      start_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    },
  );

  CalendarEvent.associate = function(models) {
    CalendarEvent.belongsTo(models.User, {
      as: 'organiser',
      foreignKey: { name: 'organiser_id', allowNull: false },
    });
    CalendarEvent.belongsToMany(models.User, {
      as: 'attendees',
      through: models.CalendarEventInvite,
      foreignKey: 'event_id',
      otherKey: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    CalendarEvent.hasMany(models.CalendarEventInvite, {
      as: 'invites',
      foreignKey: 'event_id',
      onUpdate: ' CASCADE',
      onDelete: 'CASCADE',
    });
    CalendarEvent.hasMany(models.Resource, {
      as: 'resources',
      foreignKey: 'topic_id',
      constraints: false,
      onUpdate: ' CASCADE',
      onDelete: 'CASCADE',
      scope: {
        topic_type: 'CalendarEvent',
      },
    });
  };

  return withPagination()(CalendarEvent);
};
