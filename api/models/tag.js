'use strict';

const withPagination = require('sequelize-cursor-pagination');

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('tag', {
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Tag.associate = function (models) {
    Tag.belongsToMany(models.CalendarEvent, {
      as: 'events',
      through: models.EventTag,
      foreignKey: 'tag_id',
      otherKey: 'event_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return withPagination()(Tag);
};
