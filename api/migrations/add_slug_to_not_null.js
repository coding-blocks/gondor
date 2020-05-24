'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = lower(title)  
                WHERE slug is NULL;
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = REGEXP_REPLACE(slug, '[^a-z0-9\\-_]+', '-', 'gi'); 
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = BTRIM(slug,'-') ;
                `),
    ])
      .then(() => {
        return [
          queryInterface.addIndex('calendar_events', {
            unique: true,
            fields: ['slug'],
          }),
          queryInterface.changeColumn('calendar_events', 'slug', {
            type: Sequelize.STRING,
            allowNull: false,
          }),
        ];
      })
      .catch((error) => {
        console.log(error);
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        ` UPDATE calendar_events SET slug = '';
         `,
      )
      .then(() => {
        queryInterface.changeColumn('calendar_events', 'slug', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      });
  },
};
