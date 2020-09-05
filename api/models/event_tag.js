'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const EventTag = sequelize.define(
    'event_tag',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      indexes: [{ unique: true, fields: ['event_id', 'tag_id'] }],
    },
  );

  EventTag.associate = function (models) {
    EventTag.belongsTo(models.Tag, {
      as: 'tag',
      foreignKey: { name: 'tag_id', allowNull: false },
    });
    EventTag.belongsTo(models.CalendarEvent, {
      as: 'event',
      foreignKey: { name: 'event_id', allowNull: false },
    });
  };

  return EventTag;
};
