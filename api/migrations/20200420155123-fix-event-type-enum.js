'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TYPE enum_calendar_events_type RENAME VALUE 'Metting' TO 'Meeting';
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TYPE enum_calendar_events_type RENAME VALUE 'Meeting' TO 'Metting';
    `)
  }
};
