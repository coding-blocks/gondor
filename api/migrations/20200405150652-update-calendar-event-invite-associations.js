'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .changeColumn('calendar_event_invites', 'event_id', {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'calendar_events',
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      })
      .then(() =>
        queryInterface.changeColumn('calendar_event_invites', 'user_id', {
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'users',
          },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }),
      );
  },

  down: (queryInterface, Sequelize) => {},
};
