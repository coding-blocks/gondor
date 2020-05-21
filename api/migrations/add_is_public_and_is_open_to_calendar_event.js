'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('calendar_events', 'is_open', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('calendar_events', 'is_public', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('calendar_events', 'is_open'),
      queryInterface.removeColumn('calendar_events', 'is_public'),
    ]);
  },
};
