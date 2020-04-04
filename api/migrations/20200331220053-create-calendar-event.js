'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('calendar_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM(
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
      organiser_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'users',
        },
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      start_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('calendar_events');
  },
};
