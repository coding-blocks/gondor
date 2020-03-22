'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientToken = sequelize.define(
    'client_token',
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {},
  );
  ClientToken.associate = function(models) {
    ClientToken.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    });
  };
  return ClientToken;
};
