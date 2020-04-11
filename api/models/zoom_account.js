'use strict';
module.exports = (sequelize, DataTypes) => {
  const ZoomAccount = sequelize.define(
    'zoom_account',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {},
  );
  ZoomAccount.associate = function(models) {
    ZoomAccount.hasMany(models.Resource, {
      as: 'uses',
      foreignKey: 'subject_id',
      constraints: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      scope: {
        subject_type: 'ZoomAccount',
      },
    });
  };
  return ZoomAccount;
};
