'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('user_roles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            key: 'id',
            model: 'users',
          },
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM('Admin', 'Mentor', 'Member'),
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex('user_roles', {
          unique: true,
          fields: ['role', 'user_id'],
        }),
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_roles');
  },
};
