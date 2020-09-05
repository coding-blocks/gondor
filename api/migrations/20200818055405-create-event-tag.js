'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('event_tags', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        event_id: {
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'calendar_events',
          },
          allowNull: false,
        },
        tag_id: {
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'tags',
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
        queryInterface.addIndex('event_tags', {
          unique: true,
          fields: ['event_id', 'tag_id'],
        }),
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('event_tags');
  },
};
