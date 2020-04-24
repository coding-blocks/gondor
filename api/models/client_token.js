'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientToken = sequelize.define(
    'client_token',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {},
  );
  ClientToken.associate = function (models) {
    ClientToken.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    });
  };
  return ClientToken;
};
