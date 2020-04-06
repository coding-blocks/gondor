'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('resources', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        subject_type: {
          type: Sequelize.ENUM('ZoomAccount'),
          allowNull: false,
        },
        subject_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        topic_type: {
          type: Sequelize.ENUM('CalendarEvent'),
          allowNull: false,
        },
        topic_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex('resources', {
          unique: true,
          fields: ['subject_type', 'subject_id', 'topic_type', 'topic_id'],
        }),
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('resources');
  },
};
