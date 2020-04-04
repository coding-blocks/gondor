'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('calendar_event_invites', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.ENUM(
            'Pending',
            'Accepted',
            'Declined',
            'Requested',
            'Refused',
          ),
          allowNull: false,
          defaultValue: 'Pending',
        },
        event_id: {
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'calendar_events',
          },
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'users',
          },
          allowNull: false,
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
        queryInterface.addIndex('calendar_event_invites', {
          unique: true,
          fields: ['event_id', 'user_id'],
        }),
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('calendar_event_invites');
  },
};
