'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = lower(title)  
                WHERE slug is NULL;
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = REGEXP_REPLACE(slug, '/\s+/g', '-')  
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = REGEXP_REPLACE(slug, '/[^\w\-]+/g', '')  
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = REGEXP_REPLACE(slug, '/\-\-+/g', '-')  
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = REGEXP_REPLACE(slug, '/^-+/', '')  
                `),
      queryInterface.sequelize.query(`
                UPDATE calendar_events SET slug = REGEXP_REPLACE(slug, '/-+$/', '')  
                `),
    ])
      .then(() => {
        queryInterface.addIndex('calendar_events', {
          unique: true,
          references: {
            key: 'id',
          },
          fields: ['slug'],
        }),
          queryInterface.changeColumn('calendar_events', 'slug', {
            type: Sequelize.STRING,
            references: {
              key: 'id',
            },
            allowNull: false,
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        `
                UPDATE calendar_events SET slug = null;
                `,
      )
      .then(() => {
        queryInterface.changeColumn('calendar_events', 'slug', {
          type: Sequelize.STRING,
          references: {
            key: 'id',
            model: 'calendar_events',
          },
          allowNull: true,
        });
      });
  },
};
