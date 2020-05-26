'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('calendar_events', 'is_requestable', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('calendar_events', 'auto_accept_request', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),

      queryInterface.removeColumn('calendar_events', 'is_open'),
      queryInterface.sequelize.query(
        'ALTER TABLE calendar_events ADD CONSTRAINT auto_accept_condition CHECK (not(is_requestable IS FALSE AND auto_accept_request IS TRUE ));',
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('calendar_events', 'is_requestable'),
      queryInterface.removeColumn('calendar_events', 'auto_accept_request'),
      queryInterface.addColumn('calendar_events', 'is_open', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.sequelize.query(
        'ALTER TABLE calendar_events DROP CONSTRAINT auto_accept_condition ;',
      ),
    ]);
  },
};
