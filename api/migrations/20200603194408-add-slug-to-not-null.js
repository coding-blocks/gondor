'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        `
                UPDATE calendar_events SET slug = BTRIM(REGEXP_REPLACE(lower(title), '[^a-z0-9\\-_]+', '-', 'gi'), '-')
                WHERE slug is NULL;
            `,
      )
      .then(() => {
        return [
          queryInterface.changeColumn('calendar_events', 'slug', {
            type: Sequelize.STRING,
            allowNull: false,
          }),
          queryInterface.addIndex('calendar_events', {
            unique: true,
            fields: ['slug'],
          }),
        ];
      })
      .catch((error) => {
        console.log(error);
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(` UPDATE calendar_events SET slug = '';`)
      .then(() => {
        queryInterface.changeColumn('calendar_events', 'slug', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      });
  },
};
