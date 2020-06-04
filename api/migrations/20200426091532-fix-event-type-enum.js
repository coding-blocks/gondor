'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    UPDATE pg_enum SET enumlabel = 'Meeting' 
    WHERE enumlabel = 'Metting' AND enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'enum_calendar_events_type'
      )
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    UPDATE pg_enum SET enumlabel = 'Metting' 
    WHERE enumlabel = 'Meeting' AND enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'enum_calendar_events_type'
      )
    `);
  },
};
